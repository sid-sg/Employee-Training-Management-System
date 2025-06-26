"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Monitor, MapPin } from "lucide-react"

interface TrainingFormData {
    title: string
    mode: "ONLINE" | "OFFLINE"
    description: string
    startDate: string
    endDate: string
    location: string
    platform: string
}

interface TrainingFormProps {
    form: TrainingFormData
    onFormChange: (form: TrainingFormData) => void
    onSubmit: () => void
    isLoading?: boolean
}

export function TrainingForm({ form, onFormChange, onSubmit, isLoading = false }: TrainingFormProps) {
    const isFormValid = form.title && form.description && form.startDate && form.endDate &&
        (form.mode === "ONLINE" ? form.platform : form.location)

    const handleInputChange = (field: keyof TrainingFormData, value: string) => {
        onFormChange({ ...form, [field]: value })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Training Details
                </CardTitle>
                <CardDescription>
                    Provide the basic information for your training program
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Training Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g., SAP ERP Training"
                        value={form.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Training Mode</Label>
                    <Select
                        value={form.mode}
                        onValueChange={(value) => handleInputChange('mode', value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ONLINE" className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                Online
                            </SelectItem>
                            <SelectItem value="OFFLINE" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Offline
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {form.mode === "OFFLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g., Conference Room A, Building 1"
                            value={form.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                )}

                {form.mode === "ONLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Input
                            id="platform"
                            placeholder="e.g., Zoom, Udemy, Coursera, etc."
                            value={form.platform}
                            onChange={(e) => handleInputChange('platform', e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the training objectives, topics covered, and expected outcomes..."
                        value={form.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            id="endDate"
                            type="date"
                            value={form.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={onSubmit}
                        disabled={!isFormValid || isLoading}
                        className="min-w-32"
                    >
                        {isLoading ? "Creating..." : "Create Training"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}