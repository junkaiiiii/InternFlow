"use client"

import "./calendar.css"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import Sidebar from "@/components/sidebar"
import { useState, useEffect } from "react"
import { api } from "@/libs/api"
import { TApiResponse, TApplication, TEventCalendar, TEventCreation, TEventServer } from "@/types/types"
import CreateEventPopUp from "@/components/CreateEventPopUp"
import UpdateEventPopUp from "@/components/UpdateEventPopUp"
import { EventValidator } from "@/libs/validators/event"
export default function CalendarPage() {
    const [showCreatePopUp, setShowCreatePopUp] = useState<boolean>(false)
    const [showUpdatePopUp, setShowUpdatePopUp] = useState<boolean>(false)
    const [selectedEvent, setSelectedEvent] = useState<TEventServer>()
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [events, setEvents] = useState<TEventServer[]>()
    const [calendarEvents, setCalendarEvents] = useState<TEventCalendar[]>()
    const [applications, setApplications] = useState<TApplication[]>()

    useEffect(() => {
        setIsLoading(true)

        const fetchEvents = async () => {
            const events: TApiResponse<{ events: TEventServer[] }> = await api.get('/event/allEvents')

            if (!events.success) {
                setError(events.error as string)
                setIsLoading(false)
                return
            }
            // convert duration to end
            // const cleanedEvents: TEventReturn[] = events.map(e => {

            // })

            setEvents(events.data.events)
            setCalendarEvents(events.data.events.map(e => {
                const startDate = new Date(e.start).toISOString();
                const endDate = new Date(new Date(e.start).getTime() + e.duration * 60 * 1000).toISOString();
                return {
                    id: e.id,
                    start: startDate,
                    end: endDate,
                    title: `${e.title} (Application ID: ${e.applicationId})`,
                    applicationId: e.applicationId
                };
            }));
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
            const response: TApiResponse<{ event: TEventServer }> = await api.post('/event', event)

            if (!response.success) {
                setError(response.error as string)
                setIsLoading(false)
                return
            }
            setEvents(events => [...(events || []), response.data.event])
            setCalendarEvents(events => [...(events || []), { ...response.data.event, start: new Date(response.data.event.start).toISOString(), end: new Date(new Date(response.data.event.start).getTime() + response.data.event.duration * 60 * 1000).toISOString() }])
            // setCalendarEvents(events.data.events.map(e => {
            //     const startDate = new Date(e.start).toISOString();
            //     const endDate = new Date(new Date(e.start).getTime() + e.duration * 60 * 1000).toISOString();
            //     return {
            //         id: e.id,
            //         start: startDate,
            //         end: endDate,
            //         title: `${e.title} (Application ID: ${e.applicationId})`,
            //         applicationId: e.applicationId
            //     };
            // }));
            setIsLoading(false)

        } catch (error) {
            setError("Error when creating Event")
            setIsLoading(false)
        } finally {
            setShowCreatePopUp(false)
        }
    }

    const handleUpdate = async (event: TEventServer) => {
        setIsLoading(true)
        try {
            const error = EventValidator.updateEvent(event)
            if (error) {
                setIsLoading(false)
                setError(error)
                return
            }

            const response: TApiResponse<{ message: string }> = await api.put(`/event/${event.id}`, event)

            if (!response.success){
                setIsLoading(false)
                setError(response.error as string)
                return
            }

            setEvents(prev => prev?.map(e => (
                e.id === event.id ? event : e
            )))
            setCalendarEvents(prev => prev?.map(e => (
                e.id === event.id ? {...e, duration:null, start: new Date(event.start).toISOString(), end: new Date(new Date(event.start).getTime() + event.duration * 60 * 1000).toISOString() } : e
            )))
            setIsLoading(false)
        } catch (error) {
            setError("Error when deleting Event")
            setIsLoading(false)
        } finally {
            setShowUpdatePopUp(false)
        }
    }
    

    const handleDelete = async (id: number) => {
        setIsLoading(true)
        try {
            const error = EventValidator.deleteEvent(id)
            if (error) {
                setIsLoading(false)
                setError(error)
                return
            }

            const response: TApiResponse<{ message: string }> = await api.delete(`/event/${id}`)

            if (!response.success){
                setIsLoading(false)
                setError(response.error as string)
                return
            }

            setEvents(prev => prev?.filter(e => e.id !== id))
            setCalendarEvents(prev => prev?.filter(e => e.id !== id))
            setIsLoading(false)
        } catch (error) {
            setError("Error when deleting Event")
            setIsLoading(false)
        } finally {
            setShowUpdatePopUp(false)
        }
    }

    const handleEventClick = (event: any) => {
        // 1.find actual event from events (click event from the calender doesnto return applicationId)
        // 2.showUpdatePopUp
        // 3.PRAY

        const selectedEvent = events?.find(e => e.id === Number(event.event.id))
        if (!selectedEvent) {
            setError(`Cannot find event ${event.title}`)
            return
        }

        setSelectedEvent(selectedEvent)
        setShowUpdatePopUp(true)
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
                            className="bg-primary hover:bg-primary/80 px-2 py-1 text-md font-semibold rounded-lg cursor-pointer transition active:scale-[0.98]"
                            onClick={() => setShowCreatePopUp(prev => !prev)}
                        >
                            Add Event
                        </button>
                    </div>
                </div>


                {isLoading && <h1 className="mt-30 text-2xl">Loading Calendar...</h1>}
                {error && <h1 className="mt-30 text-2xl">{error}</h1>}
                {!isLoading && (
                    <div className=".fc mt-10">
                        <FullCalendar
                            eventClassNames={"rounded-lg px-2 text-2xl font-medium"}
                            plugins={[dayGridPlugin, timeGridPlugin]}
                            initialView="timeGridWeek"
                            events={calendarEvents?.map(event => ({ ...event, id: event.id.toString() }))}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "timeGridWeek,dayGridMonth",
                            }}
                            eventColor="#00d492 "        // all events color
                            eventTextColor="#ffffff"
                            eventDisplay="HELLO"
                            eventClick={(e) => { console.log(e); handleEventClick(e) }}
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

                {(showUpdatePopUp && selectedEvent)&& (
                    <UpdateEventPopUp
                        onClose={() => setShowUpdatePopUp(false)}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete }
                        applications={applications as TApplication[]}
                        event={selectedEvent}
                    />
                )}

            </main>
        </div>
    )
}