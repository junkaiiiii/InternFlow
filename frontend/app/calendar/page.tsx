"use client"

import "./calendar.css"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import Sidebar from "@/components/sidebar"
import { useState, useEffect } from "react"
import { api } from "@/libs/api"
import { TApiResponse, TApplication, TEventClient, TEventCreation } from "@/types/types"
import CreateEventPopUp from "@/components/CreateEventPopUp"
import { EventValidator } from "@/libs/validators/event"
export default function CalendarPage() {
    const [showCreatePopUp, setShowCreatePopUp] = useState<boolean>(false)
    const [showUpdatePopUp, setShowUpdatePopUp] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [events, setEvents] = useState<TEventClient[]>()
    const [applications, setApplications] = useState<TApplication[]>()

    useEffect(() => {
        setIsLoading(true)

        const fetchEvents = async () => {
            const events: TApiResponse<{ events: TEventClient[] }> = await api.get('/event/allEvents')

            if (!events.success) {
                setError(events.error as string)
                setIsLoading(false)
                return
            }

            setEvents(events.data.events)
        }



        const fetchApplications = async () => {
            const applications: TApiResponse<{ applications: TApplication[] }> = await api.get('/board/application')
            if (!applications.success) {
                setError(applications.error as string)
                setIsLoading(false)
                return
            }
            setApplications(applications.data.applications)
        }

        fetchEvents().catch(() => {
            setError("Error when fetching events")
            setIsLoading(false)
        })
        fetchApplications().catch(() => {
            setError("Error when fetching applications")
            setIsLoading(false)
        })

        setIsLoading(false)
    }, [])


    const handleCreate = async (event: any) => {
        try {
            const error = EventValidator.createEvent(event)

            if (error) {
                setError(error)
                return
            }

            setIsLoading(true)
            const response: TApiResponse<{event: TEventClient}> = await api.post('/event',event)

            if (!response.success){
                setError(response.error as string)
                setIsLoading(false)
                return
            }
            setShowCreatePopUp(false)
            setEvents(events => [...(events || []), response.data.event])
            setIsLoading(false)
            
        } catch (error){
            setError("Error when creating Event")
            setIsLoading(false)
        }
    }

    const handleUpdate = async () => {

    }

    const handleDelete = async () => {

    }

    // const events = [
    //   { title: "Interview at Google", start: "2026-05-14T00:00:00.000Z", end: "2026-05-14T02:00:00.000Z" },
    // ]
    console.log(events, applications)
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

                    <div>
                        <button
                            className="bg-primary hover:bg-primary/80 px-2 py-1 text-md font-semibold rounded-lg cursor-pointer transition"
                            onClick={() => setShowCreatePopUp(prev => !prev)}
                        >
                            Add Event
                        </button>
                    </div>
                </div>


                {isLoading && <h1 className="mt-30 text-2xl">Loading Calendar...</h1>}
                {error && <h1 className="mt-30 text-2xl">{error}</h1>}
                {!isLoading  && (
                    <div className=".fc mt-10">
                        <FullCalendar
                            eventClassNames={"rounded-lg px-2 text-2xl font-medium"}
                            plugins={[dayGridPlugin, timeGridPlugin]}
                            initialView="timeGridWeek"
                            events={events?.map(event => ({ ...event, id: event.id.toString() }))}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "timeGridWeek,dayGridMonth",
                            }}
                            eventColor="#00d492 "        // all events color
                            eventTextColor="#ffffff"
                            eventDisplay="HELLO"
                            eventClick={() => { }}
                            slotDuration={"01:00:00"}
                            expandRows={true}
                            allDaySlot={false}
                            nowIndicator={true}
                        />
                    </div>

                )}
                {showCreatePopUp && (
                    <CreateEventPopUp
                        onClose={() => setShowCreatePopUp(false)}
                        onSubmit={handleCreate}
                        applications={applications as TApplication[]}
                    />
                )}
               
            </main>
        </div>
    )
}