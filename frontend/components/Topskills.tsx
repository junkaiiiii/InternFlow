import type { TTopSkill } from "@/types/types"

interface TopSkillsProps {
  data: TTopSkill[]
}

export function TopSkills({ data }: TopSkillsProps) {
  const max = data[0]?.count ?? 1

  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
        Top skills
      </h3>

      <div className="space-y-3">
        {data.map((s, i) => (
          <div key={s.skill}>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                <span>{s.skill}</span>
              </span>
              <span className="text-muted-foreground">{s.count}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-[#534AB7] transition-all duration-500"
                style={{ width: `${Math.round((s.count / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}