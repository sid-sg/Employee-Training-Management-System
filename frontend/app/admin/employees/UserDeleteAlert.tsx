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

interface User {
    id: string
    name: string
    employeeid: string
    email: string
    department: string
    phonenumber?: string
    role: "EMPLOYEE" | "HR_ADMIN"
}

export function UserDeleteAlert({ user, onDelete }: { user: User, onDelete: (id: string) => void }) {
  const [loading, setLoading] = useState(false)

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await axios.delete(`http://localhost:3000/api/user/${user.id}`, {
        withCredentials: true,
      })
      
      if (res.status === 200) {
        onDelete(user.id)
        toast.success(`Deleted "${user.name}"`)
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete user")
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
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete <strong>{user.name}</strong> ({user.employeeid})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-red-600"
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