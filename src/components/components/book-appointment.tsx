"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookAppointmentProps {
  className?: string;
  bookedDates?: Date[]; // Array of dates that are already booked
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate time slots from 9 AM to 5 PM with 15-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 17 && minute > 0) break; // Stop at 5:00 PM
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const timeString = `${displayHour}:${minute
        .toString()
        .padStart(2, "0")} ${period}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export const BookAppointment = ({
  className,
  bookedDates = [],
}: BookAppointmentProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getDate() === date.getDate() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getFullYear() === date.getFullYear()
    );
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Handle date selection
  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle infinite scroll and perspective effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const updatePerspective = () => {
      const buttons = scrollContainer.querySelectorAll("button");
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      buttons.forEach((button) => {
        const buttonRect = button.getBoundingClientRect();
        const buttonCenter = buttonRect.top + buttonRect.height / 2;
        const distanceFromCenter = buttonCenter - containerCenter;
        const maxDistance = containerRect.height / 2;
        const normalizedDistance = Math.abs(distanceFromCenter) / maxDistance;

        // Apply perspective transform based on distance from center
        if (normalizedDistance > 0.5) {
          const intensity = (normalizedDistance - 0.5) * 2; // 0 to 1
          const rotateX =
            distanceFromCenter > 0 ? intensity * 45 : -intensity * 45;
          const scale = 1 - intensity * 0.3;
          const opacity = 1 - intensity * 0.5;

          (
            button as HTMLElement
          ).style.transform = `perspective(500px) rotateX(${rotateX}deg) scale(${scale})`;
          (button as HTMLElement).style.opacity = opacity.toString();
        } else {
          (button as HTMLElement).style.transform =
            "perspective(500px) rotateX(0deg) scale(1)";
          (button as HTMLElement).style.opacity = "1";
        }
      });
    };

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      updatePerspective();

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollThreshold = 100;

      // Scrolled near top - loop to bottom
      if (scrollTop < scrollThreshold) {
        isScrollingRef.current = true;
        scrollContainer.scrollTop =
          scrollHeight - clientHeight - scrollThreshold;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }
      // Scrolled near bottom - loop to top
      else if (scrollTop > scrollHeight - clientHeight - scrollThreshold) {
        isScrollingRef.current = true;
        scrollContainer.scrollTop = scrollThreshold;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 50);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Set initial scroll position to middle
    scrollContainer.scrollTop =
      (scrollContainer.scrollHeight - scrollContainer.clientHeight) / 2;

    // Initial perspective update
    updatePerspective();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div
      className={cn(
        "w-full max-w-lg mx-auto bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-400/50 dark:border-neutral-800 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-neutral-400/50 text-center dark:border-neutral-800 p-2">
        <span className="text-sm font-semibold text-center text-neutral-950 dark:text-neutral-100">
          Book an appointment
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-8 border-b border-neutral-400/50 dark:border-neutral-800">
        {/* Calendar Section - 3 columns */}
        <div className="col-span-5 p-3 border-r border-neutral-400/50 dark:border-neutral-800">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs md:text-sm font-semibold">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] md:text-xs font-medium text-neutral-600 dark:text-neutral-400 py-1"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const date = new Date(year, month, day);
              const booked = isDateBooked(date);
              const selected = isDateSelected(date);
              const today = isToday(date);

              return (
                <motion.button
                  key={`${year}-${month}-${day}`}
                  onClick={() => !booked && handleDateClick(day)}
                  disabled={booked}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.01 }}
                  className={cn(
                    "aspect-square md:w-8 md:h-8 w-6 h-6 rounded flex items-center justify-center text-[9px] md:text-xs font-medium transition-all relative",
                    booked
                      ? " text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                      : selected
                      ? "bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-950"
                      : today
                      ? "bg-neutral-200 dark:bg-neutral-800"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                  whileHover={!booked ? { scale: 1.05 } : {}}
                  whileTap={!booked ? { scale: 0.95 } : {}}
                >
                  <span className={cn(booked && "line-through")}>{day}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Section - 1 column */}
        <div className="col-span-3 p-2 relative flex pb-7 flex-col items-center gap-2">
          {/* Time Slots with Perspective Scroll */}
          <div
            className="relative w-full max-h-48 md:max-h-58 overflow-hidden"
            style={{ perspective: "500px" }}
          >
            {/* Top fade */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />

            {/* Scrollable container */}
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto scrollbar-hide px-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="flex flex-col gap-1.5 py-4"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Render time slots 3 times for infinite scroll effect */}
                {[...Array(3)].map((_, copyIndex) => (
                  <React.Fragment key={`copy-${copyIndex}`}>
                    {TIME_SLOTS.map((time, index) => (
                      <motion.button
                        key={`${time}-${copyIndex}-${index}`}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "px-2 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800/50 text-xs font-medium whitespace-nowrap",
                          selectedTime === time
                            ? "bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-950"
                            : "bg-white dark:bg-neutral-900 "
                        )}
                        style={{
                          transition:
                            "transform 0.1s ease-out, opacity 0.1s ease-out, background-color 0.2s",
                          transformStyle: "preserve-3d",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-[10px] md:text-xs">{time}</span>
                      </motion.button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Book Button */}
          <motion.button
            className="w-full px-3 absolute bottom-2 left-1/2 -translate-x-1/2 max-w-20 md:max-w-40 py-1.5 md:py-2 bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-950 rounded-lg font-semibold text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            BOOK
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 text-center">
        <span className="text-xs text-neutral-700 dark:text-neutral-300 text-center">
          Appointment to be booked is{" "}
          <span className="font-semibold">{formatDate(selectedDate)}</span> at{" "}
          <span className="font-semibold">{selectedTime}</span>
        </span>
      </div>
    </div>
  );
};

export default BookAppointment;
