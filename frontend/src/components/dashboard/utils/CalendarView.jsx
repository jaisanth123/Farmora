// src/components/dashboard/CalendarView.jsx
import React from "react";
import { motion } from "framer-motion";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ events }) => {
  // Custom calendar event styling
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color || "#3B82F6",
      borderRadius: "4px",
      color: "white",
      border: "none",
      display: "block",
    };
    return {
      style,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-sm p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Farm Calendar</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg">
            Add Event
          </button>
        </div>
      </div>
      <div className="h-screen max-h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          defaultDate={new Date()}
        />
      </div>
    </motion.div>
  );
};

export default CalendarView;
