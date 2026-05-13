'use client'

import { TApplication, AppicationPriority } from "@/types/types"
import { useState } from "react"
import { X } from "lucide-react"

type TApplicationCreation = Omit<
  TApplication,
  "id" | "column" | "createdAt"
>

type Props = {
  isShowing: boolean
  columnId: number
  order: number
  onClose: ()=> void
}

export default function CreateApplicationPopUp({
  isShowing,
  columnId,
  order, 
  onClose
}: Props) {
  if (!isShowing) return null

  const [skillInput, setSkillInput] = useState("")

  const [formData, setFormData] = useState<TApplicationCreation>({
    columnId,
    company: "",
    role: "",
    order,
    priority: AppicationPriority.medium,
    skills: [],
    url: "",
    appliedAt: null,
  })

  const addSkill = () => {
    if (!skillInput.trim()) return

    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()],
    }))

    setSkillInput("")
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill),
    }))
  }
  const handleSubmit = async () => {
    console.log("hi")
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-background p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Create Application
            </h2>
            <p className="text-sm text-gray-400">
              Add a new internship application
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Company
            </label>

            <input
              type="text"
              placeholder="Google"
              value={formData.company}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Role
            </label>

            <input
              type="text"
              placeholder="Frontend Developer Intern"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
            />
          </div>

          {/* URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Job URL
            </label>

            <input
              type="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  url: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Priority
            </label>

            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as AppicationPriority,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
            >
              <option value={AppicationPriority.low}>Low</option>
              <option value={AppicationPriority.medium}>Medium</option>
              <option value={AppicationPriority.high}>High</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Skills
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="React"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
              />

              <button
                type="button"
                onClick={addSkill}
                className="rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                Add
              </button>
            </div>

            {/* Skill Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.skills?.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-sm text-white"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-gray-300 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Applied Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Applied Date
            </label>

            <input
              type="date"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appliedAt: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}