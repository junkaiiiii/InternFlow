'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { TEventCreation, TApplication, TEventServer } from '@/types/types'
import { toLocalDateTimeString, fromLocalDateTimeString } from '@/libs/utils'


type Props = {
    onClose: () => void
    onUpdate: (event: any) => void
    onDelete: (id: number) => void
    applications: TApplication[]
    event: TEventServer
}

export default function UpdateEventPopUp({
    onClose, onUpdate, onDelete, applications, event
}: Props) {
    const [formData, setFormData] = useState<TEventServer>(event)

    // when applications load, set the default
    useEffect(() => {
        if (applications?.length > 0) {
            setFormData(prev => ({ ...prev, applicationId: applications[0].id }))
        }
    }, [applications])

    const handleClose = () => {
        setFormData({
            id: 0,
            title: '',
            start: '',
            duration: 60,
            applicationId: 0,
        })

        onClose()
    }

    const handleSubmit = () => {
        console.log("=== DEBUG ===")
        console.log("raw formData.start:", formData.start)
        console.log("parsed as Date:", new Date(formData.start))
        console.log("toISOString:", new Date(formData.start).toISOString())
        onUpdate(formData)
        setFormData({
            id: 0,
            title: '',
            start: '',
            duration: 60,
            applicationId: 0,
        })
    }

    const handleDelete = (id: number) => {
        setFormData({
            id: 0,
            title: '',
            start: '',
            duration: 60,
            applicationId: 0,
        })
        onDelete(id)
    }

    console.log(formData)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-background p-6 shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Update Event
                        </h2>

                        <p className="text-sm text-gray-400">
                            Update date of a new interview or task
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                {/* <form className="space-y-5"> */}
                {/* Title */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Event Title
                    </label>

                    <input
                        type="text"
                        placeholder="Technical Interview"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                title: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
                    />
                </div>

                {/* Start Date & Time */}
                <div className='mt-3'>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Start Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        value={formData.start}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                        style={{ colorScheme: 'dark' }}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
                    />
                </div>

                {/* Duration */}
                <div className='mt-3'>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Duration (minutes)
                    </label>

                    <input
                        type="number"
                        placeholder="60"
                        value={formData.duration}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                duration: Number(e.target.value),
                            })
                        }
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
                    />
                </div>

                {/* Application ID */}
                <div className='mt-3'>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Application ID
                    </label>

                    <div className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary">
                        <select
                            className='w-full'
                            value={formData.applicationId}
                            onChange={(e) => { console.log('change'); setFormData({ ...formData, applicationId: parseInt(e.target.value) }) }}
                        >
                            {applications?.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.company + '-' + a.role}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition bg-red-600 hover:bg-red-600/50 cursor-pointer"
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/10 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90 cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Update Event
                    </button>
                </div>
                {/* </form> */}
            </div>
        </div>
    )
}