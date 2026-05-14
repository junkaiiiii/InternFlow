"use client"

import "./calendar.css"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import Sidebar from "@/components/sidebar"

export default function CalendarPage() {
  const events = [
    { title: "Interview at Google", start: "2026-05-14T00:00:00.000Z", end: "2026-05-14T02:00:00.000Z" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Header */}


      <main className="min-w-0 px-4 py-6 sm:px-6 lg:pl-72 lg:pr-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Event Calendars</h2>
            <p className="text-sm text-gray-500">Check out upcoming events easily</p>
          </div>

        </div>


        {/* {isLoading && <h1 className="mt-30 text-2xl">Loading board...</h1>}
        {error && <h1 className="mt-30 text-2xl">{error}</h1>}
        {!isLoading && !error && ( */}
        <div className=".fc mt-10">
          <FullCalendar
            timeZone="locale"
            eventClassNames={"rounded-lg px-2 text-2xl font-medium"}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,dayGridMonth",
            }}
            eventColor="#00d492 "        // all events color
            eventTextColor="#ffffff"
            eventDisplay="HELLO"
            slotDuration={"00:30:00"}
            expandRows={true}
            allDaySlot={false}
            nowIndicator={true}
          />
        </div>

        {/* )} */}
      </main>
    </div>

  )
}