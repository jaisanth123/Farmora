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
            scope: "https://www.googleapis.com/auth/calendar.readonly",
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
