import { MoreHorizontal, Plus, GripVertical } from "lucide-react"
import type { TBoard, TColumn, TApplication } from "@/types/types"


const priorityColors = {
  high: "bg-primary",
  medium: "bg-warning",
  low: "bg-muted-foreground",
}


export default function KanbanCardItem({ card }: { card: TApplication}) {
    return (
      <div className="group relative rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-sm cursor-grab active:cursor-grabbing">
        {/* Priority indicator */}
        <div className={`absolute left-0 top-3 h-4 w-0.5 rounded-r ${priorityColors[card.priority]}`} />
        
        {/* Drag handle - visible on hover */}
        <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
  
        {/* Company logo placeholder */}
        <div className="flex items-start gap-3 mb-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-foreground">
            {card.company.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">{card.company}</h4>
            <p className="text-xs text-muted-foreground truncate">{card.role}</p>
          </div>
        </div>
  
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {card.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
  
        {/* Footer */}
          <p className="mt-2 text-[10px] text-muted-foreground">
            {card.appliedAt ? card.appliedAt.toLocaleDateString() : "N/A"}
          </p>

      </div>
    )
  }
  