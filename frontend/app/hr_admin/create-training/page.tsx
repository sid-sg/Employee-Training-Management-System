"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"

export default function CreateTrainingPage() {

    const [form, setForm] = useState({
        title: "",
        mode: "OFFLINE",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        platform: "",
    })
    const router = useRouter()
    useEffect(() => {
        const userType = localStorage.getItem("userRole")
        if (userType !== "HR_ADMIN") {
            router.push("/")
            return
        }
    }, [router])

    const handleSubmit = async () => {
        const token = localStorage.getItem("token")
        try {
            await axios.post(
                "http://localhost:3000/api/training",
                form,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success("Training created successfully")
            router.push("/hr-admin/dashboard")
        } catch (err) {
            toast.error("Error creating training")
            console.error(err)
        }

    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Create New Training</h1>
            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                    <Label>Mode</Label>
                    <Select value={form.mode} onValueChange={(value) => setForm({ ...form, mode: value as "ONLINE" | "OFFLINE" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ONLINE">ONLINE</SelectItem>
                            <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {form.mode === "OFFLINE" && (
                    <div>
                        <Label>Location</Label>
                        <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </div>
                )}
                {form.mode === "ONLINE" && (
                    <div>
                        <Label>platform</Label>
                        <Input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
                    </div>
                )}
                <div>
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Start Date</Label>
                        <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                    </div>
                    <div>
                        <Label>End Date</Label>
                        <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                    </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">Create Training</Button>
            </div>
        </div>
    )
}
