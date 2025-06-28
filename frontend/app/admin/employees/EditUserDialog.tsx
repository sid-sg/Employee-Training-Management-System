import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "axios"

interface User {
    id: string
    name: string
    employeeid: string
    email: string
    department: string
    phonenumber?: string
    role: "EMPLOYEE" | "HR_ADMIN"
}

interface EditUserDialogProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
    onUpdate: (updatedUser: User) => void
}

export function EditUserDialog({ user, isOpen, onClose, onUpdate }: EditUserDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        employeeid: "",
        email: "",
        department: "",
        phonenumber: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                employeeid: user.employeeid,
                email: user.email,
                department: user.department,
                phonenumber: user.phonenumber || ""
            })
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!user) return

        // Validate form
        if (!formData.name || !formData.employeeid || !formData.email || !formData.department) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsLoading(true)

        try {
            const token = localStorage.getItem("token")
            const res = await axios.patch(`http://localhost:3000/api/user/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            if (res.status === 200) {
                const updatedUser = { ...user, ...formData }
                onUpdate(updatedUser)
                toast.success("User updated successfully!")
                onClose()
            }
        } catch (error: any) {
            console.error("Update error:", error)
            toast.error(error.response?.data?.error || "Failed to update user")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information. Password cannot be changed from here.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name *
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeid" className="text-right">
                                Employee ID *
                            </Label>
                            <Input
                                id="employeeid"
                                value={formData.employeeid}
                                onChange={(e) => setFormData(prev => ({ ...prev, employeeid: e.target.value }))}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                                Department *
                            </Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phonenumber" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phonenumber"
                                value={formData.phonenumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, phonenumber: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 