'use client'

import { AppicationPriority, TApplicationCreation } from "@/types/types"
import { FormEvent, useState } from "react"
import { X } from "lucide-react"


type Props = {
  isShowing: boolean
  columnId: number
  order: number
  onClose: () => void
  onSubmit: (application: TApplicationCreation) => void | Promise<void>
}

export default function CreateApplicationPopUp({
  isShowing,
  columnId,
  order,
  onClose,
  onSubmit
}: Props) {
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

  if (!isShowing) return null

  const addSkill = () => {
    const nextSkill = skillInput.trim()
    if (!nextSkill || formData.skills?.includes(nextSkill)) return

    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), nextSkill],
    }))

    setSkillInput("")
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const pendingSkill = skillInput.trim()
    const application = {
      ...formData,
      columnId,
      order,
      skills: pendingSkill && !formData.skills?.includes(pendingSkill)
        ? [...(formData.skills || []), pendingSkill]
        : formData.skills,
    }

    await onSubmit(application)
    setFormData(prev => ({
      ...prev,
      company: '',
      role: '',
      priority: AppicationPriority.medium,
      skills: [],
      url: '',
      appliedAt: null
    }))
    setSkillInput('')
  }

  const handleClose = () => {
    setFormData(prev => ({
      ...prev,
      company: '',
      role: '',
      priority: AppicationPriority.medium,
      skills: [],
      url: '',
      appliedAt: null
    }))
    setSkillInput('')
    onClose()
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
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
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
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary cursor-pointer"
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
                className="rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:opacity-90 cursor-pointer"
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
                    className="text-gray-300 hover:text-white cursor-pointer"
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
              value={formData.appliedAt ? String(formData.appliedAt).slice(0, 10) : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appliedAt: e.target.value || null,
                })
              }
              style={{ colorScheme: 'dark' }}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary text-white"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90 cursor-pointer focus: pcacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
