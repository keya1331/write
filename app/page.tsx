import EntryForm from "@/components/entry-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarDays, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/timeline">
            <CalendarDays className="h-4 w-4 mr-2" />
            Timeline
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      </div>

      <EntryForm />
    </div>
  )
}
