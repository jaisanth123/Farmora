// src/utils/calendarService.js

export const fetchGoogleCalendarEvents = async () => {
  // Create helper function to assign colors based on event type
  const getEventColor = (eventTitle) => {
    const title = eventTitle.toLowerCase();
    if (title.includes("harvest")) return "#10B981"; // green
    if (title.includes("pesticide")) return "#F59E0B"; // yellow
    if (title.includes("irrigation")) return "#3B82F6"; // blue
    if (title.includes("market")) return "#8B5CF6"; // purple
    if (title.includes("soil")) return "#EC4899"; // pink
    return "#3B82F6"; // default blue
  };

  return new Promise((resolve, reject) => {
    // Load the Google API client
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        try {
          // Initialize the Google API client
          await window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
            scope:
              "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
          });

          // Check if the user is signed in
          if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            await window.gapi.auth2.getAuthInstance().signIn();
          }

          // Fetch events from the calendar
          const response = await window.gapi.client.calendar.events.list({
            calendarId: "primary", // or use a specific calendar ID
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime",
          });

          // Transform the response into the format your app expects
          const googleEvents = response.result.items.map((event) => {
            return {
              title: event.summary,
              start: new Date(event.start.dateTime || event.start.date),
              end: new Date(event.end.dateTime || event.end.date),
              allDay: !event.start.dateTime,
              resource: event.description || "Unknown",
              color: getEventColor(event.summary),
              id: event.id,
            };
          });

          resolve(googleEvents);
        } catch (error) {
          console.error("Error fetching Google Calendar events:", error);
          reject(error);
        }
      });
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google API client script"));
    };

    document.body.appendChild(script);
  });
};

// Function to add event to Google Calendar
export const addEventToGoogleCalendar = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure Google API is loaded and initialized
      if (!window.gapi || !window.gapi.client || !window.gapi.client.calendar) {
        // If not loaded, need to initialize first
        await loadAndInitializeGoogleApi();
      }

      // Format the event for Google Calendar API
      const googleEvent = {
        summary: event.title,
        description: event.resource || "",
        start: {
          dateTime: event.allDay ? undefined : event.start.toISOString(),
          date: event.allDay
            ? formatDateForGoogleCalendar(event.start)
            : undefined,
        },
        end: {
          dateTime: event.allDay ? undefined : event.end.toISOString(),
          date: event.allDay
            ? formatDateForGoogleCalendar(event.end)
            : undefined,
        },
        colorId: getGoogleColorId(
          event.color || getEventColorByType(event.type)
        ),
      };

      // Insert the event
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: googleEvent,
      });

      // Transform the response to match your app's event format
      const createdEvent = {
        id: response.result.id,
        title: response.result.summary,
        start: new Date(
          response.result.start.dateTime || response.result.start.date
        ),
        end: new Date(response.result.end.dateTime || response.result.end.date),
        allDay: !response.result.start.dateTime,
        resource: response.result.description || "",
        color: event.color || getEventColorByType(event.type),
      };

      resolve(createdEvent);
    } catch (error) {
      console.error("Error adding event to Google Calendar:", error);
      reject(error);
    }
  });
};

// Helper function to ensure Google API is loaded and initialized
const loadAndInitializeGoogleApi = async () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.gapi && window.gapi.client && window.gapi.client.calendar) {
      resolve();
      return;
    }

    // Load the Google API client
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", async () => {
        try {
          // Initialize the Google API client
          await window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
            scope:
              "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
          });

          // Check if the user is signed in
          if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            await window.gapi.auth2.getAuthInstance().signIn();
          }

          resolve();
        } catch (error) {
          console.error("Error initializing Google API client:", error);
          reject(error);
        }
      });
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google API client script"));
    };

    document.body.appendChild(script);
  });
};

// Helper function to format date for Google Calendar all-day events
const formatDateForGoogleCalendar = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get event color based on type
const getEventColorByType = (type) => {
  switch (type) {
    case "harvest":
      return "#10B981"; // green
    case "pesticide":
      return "#F59E0B"; // yellow
    case "irrigation":
      return "#3B82F6"; // blue
    case "market":
      return "#8B5CF6"; // purple
    case "soil":
      return "#EC4899"; // pink
    default:
      return "#3B82F6"; // default blue
  }
};

// Helper function to map color hex codes to Google Calendar colorIds
const getGoogleColorId = (hexColor) => {
  // Google Calendar has a limited set of colors, each with an ID
  // This is a simplified mapping, you may want to choose the closest match
  const colorMap = {
    "#10B981": "2", // green
    "#F59E0B": "5", // yellow
    "#3B82F6": "1", // blue
    "#8B5CF6": "3", // purple
    "#EC4899": "4", // pink
  };

  return colorMap[hexColor] || "1"; // default to blue (1) if no match
};
