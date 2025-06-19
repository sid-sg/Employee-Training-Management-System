// TrainingRow.tsx
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export function TrainingDeleteAlert({ training, onDelete }: { training: any, onDelete: (id: string) => void }) {
  const [loading, setLoading] = useState(false)

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:3000/api/training/${training.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete")

      onDelete(training.id)
      toast.success(`Deleted "${training.title}"`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete training")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete training?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you really want to delete <strong>{training.title}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
