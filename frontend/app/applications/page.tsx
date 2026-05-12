import Sidebar from "@/components/sidebar"
import { KanbanBoard } from "@/components/KanbanBoard"
import type { TColumn, TApplication } from "@/types/types"
import {AppicationPriority} from "@/types/types"

export default function Applications(){
    const COLUMNS: Record<string, TApplication[]> = {
        Wishlist: [
          {
            id: 1,
            columnId: 1,
            column: {} as TColumn,
            company: "Shortcut Asia",
            role: "Internship",
            order: 1,
            priority: AppicationPriority.high,
            skills: ["React", "TypeScript"],
            appliedAt: null,
            createdAt: new Date(),
          },
        ],
      
        Applied: [
          {
            id: 2,
            columnId: 2,
            column: {} as TColumn,
            company: "Meta",
            role: "Internship",
            order: 1,
            priority: AppicationPriority.medium,
            skills: ["Node.js", "GraphQL"],
            appliedAt: new Date(),
            createdAt: new Date(),
          },
        ],
      
        Assessment: [
          {
            id: 3,
            columnId: 3,
            column: {} as TColumn,
            company: "Google",
            role: "Internship",
            order: 1,
            priority: AppicationPriority.high,
            skills: ["Python", "Algorithms"],
            appliedAt: new Date(),
            createdAt: new Date(),
          },
        ],
      
        Interview: [
          {
            id: 4,
            columnId: 4,
            column: {} as TColumn,
            company: "Grab",
            role: "Internship",
            order: 1,
            priority: AppicationPriority.high,
            skills: ["React Native", "Firebase"],
            appliedAt: new Date(),
            createdAt: new Date(),
          },
        ],
      
        Offer: [
          {
            id: 5,
            columnId: 5,
            column: {} as TColumn,
            company: "Maxis",
            role: "Internship",
            order: 1,
            priority: AppicationPriority.low,
            skills: ["Java", "Spring Boot"],
            appliedAt: new Date(),
            createdAt: new Date(),
          },
        ],
      
        Rejected: [
          {
            id: 6,
            columnId: 6,
            column: {} as TColumn,
            company: "GG",
            role: "Internship",
            order: 1,
            priority: AppicationPriority.low,
            skills: ["C++", "SQL"],
            appliedAt: new Date(),
            createdAt: new Date(),
          },
        ],
      }

    
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="min-w-0 px-4 py-6 sm:px-6 lg:pl-72 lg:pr-8">
                <KanbanBoard 
                    initialData={COLUMNS}
                />
            </main>
        </div>
    )
}
