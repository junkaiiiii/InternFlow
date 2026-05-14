import { GripVertical, Trash2 } from "lucide-react"
import type { TApplication } from "@/types/types"


const priorityColors = {
	high: "bg-emerald-400",
	medium: "bg-emerald-600",
	low: "bg-emerald-900",
}

type Props = {
	card: TApplication,
	color: string,
	minimized: boolean
	onDelete: (id: number) => void
}


export default function KanbanCardItem({ card, color, minimized, onDelete }: Props) {
	const appliedAt = card.appliedAt ? new Date(card.appliedAt).toLocaleDateString() : "N/A"

	return (
		<div className="group relative rounded-lg border border-gray-500 py-3 px-5 transition-all duration-200 hover:border-primary/30 hover:shadow-sm cursor-grab active:cursor-grabbing mt-4 bg-background"
		>

			<div className={`absolute left-0 top-3 h-10 w-[3px] rounded-r ${priorityColors[card.priority]}`} />

			<div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
				onClick={(e) => {
					e.stopPropagation()
					console.log("delete")
					onDelete(card.id)
				}}
			>
				<Trash2 className="h-4 w-4 text-red-500" />
			</div>

			<div className="flex items-start gap-5 ">
				<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-foreground`} style={{ backgroundColor: color }}>
					{card.company.charAt(0)}
				</div>
				<div className="flex-1 min-w-0">
					<h4 className="text-md font-semibold text-foreground truncate">{card.company}</h4>
					<p className="text-sm text-muted-foreground truncate">{card.role}</p>
				</div>
			</div>

			{
				!minimized && (
					<div>
						<div className="flex items-center gap-1.5 flex-wrap mt-6 ">
							{card.skills?.map((skill, index) => (
								<span
									key={index}
									className="inline-flex items-center rounded px-1.5 py-0.5 text-sm font-medium bg-muted text-muted-foreground border-primary/50 border rounded-full"
								>
									{skill}
								</span>
							))}
						</div>

						<p className="mt-2 text-sm text-gray-500">
							Applied at: {appliedAt}
						</p>
					</div>
				)
			}


		</div>


	)
}

