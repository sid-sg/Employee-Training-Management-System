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
import axios from "@/utils/axios"

export function TrainingDeleteAlert({ training, onDelete }: { training: any, onDelete: (id: string) => void }) {
  const [loading, setLoading] = useState(false)

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      const res = await axios.delete(`http://localhost:3000/api/training/${training.id}`, {
        withCredentials: true
      })
      
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
    <div onClick={(e) => e.stopPropagation()}>
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
            <AlertDialogAction
              className="text-white  bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={handleConfirmDelete}
              disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
