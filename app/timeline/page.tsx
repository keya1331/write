import CalendarView from "@/components/calendar-view"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Timeline() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-light">Timeline</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to writing
          </Link>
        </Button>
      </div>

      <CalendarView />
    </div>
  )
}
