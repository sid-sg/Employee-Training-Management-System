"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Monitor, MapPin, AlertCircle } from "lucide-react"
import { trainingFormSchema, TrainingFormData } from "@/lib/validations/hr-admin.validation"
import { validateForm, getFieldError } from "@/lib/validations/form-utils"

interface TrainingFormProps {
    form: TrainingFormData
    onFormChange: (form: TrainingFormData) => void
    onSubmit: () => void
    isLoading?: boolean
}

export function TrainingForm({ form, onFormChange, onSubmit, isLoading = false }: TrainingFormProps) {
    const [errors, setErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateAndSubmit = () => {
        // Clear previous errors
        setErrors([]);
        setFieldErrors({});

        // Validate the form
        const validation = validateForm(trainingFormSchema, form);
        
        if (!validation.success) {
            setErrors(validation.errors);
            
            // Create field-specific error mapping
            const fieldErrorMap: Record<string, string> = {};
            validation.errors.forEach(error => {
                if (error.includes('title')) fieldErrorMap.title = error;
                else if (error.includes('description')) fieldErrorMap.description = error;
                else if (error.includes('mode')) fieldErrorMap.mode = error;
                else if (error.includes('location')) fieldErrorMap.location = error;
                else if (error.includes('platform')) fieldErrorMap.platform = error;
                else if (error.includes('start date')) fieldErrorMap.startDate = error;
                else if (error.includes('end date')) fieldErrorMap.endDate = error;
            });
            setFieldErrors(fieldErrorMap);
            return;
        }

        // If validation passes, call the submit function
        onSubmit();
    };

    const handleInputChange = (field: keyof TrainingFormData, value: string) => {
        // Clear field-specific error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
        
        onFormChange({ ...form, [field]: value });
    };

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
                {/* General validation errors */}
                {errors.length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please fix the following errors:
                            <ul className="mt-2 list-disc list-inside">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="title">Training Title *</Label>
                    <Input
                        id="title"
                        placeholder="e.g., SAP ERP Training"
                        value={form.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        disabled={isLoading}
                        className={fieldErrors.title ? "border-red-500" : ""}
                    />
                    {fieldErrors.title && (
                        <p className="text-sm text-red-500">{fieldErrors.title}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Training Mode *</Label>
                    <Select
                        value={form.mode}
                        onValueChange={(value) => handleInputChange('mode', value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger className={fieldErrors.mode ? "border-red-500" : ""}>
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
                    {fieldErrors.mode && (
                        <p className="text-sm text-red-500">{fieldErrors.mode}</p>
                    )}
                </div>

                {form.mode === "OFFLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                            id="location"
                            placeholder="e.g., Conference Room A, Building 1"
                            value={form.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            disabled={isLoading}
                            className={fieldErrors.location ? "border-red-500" : ""}
                        />
                        {fieldErrors.location && (
                            <p className="text-sm text-red-500">{fieldErrors.location}</p>
                        )}
                    </div>
                )}

                {form.mode === "ONLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform *</Label>
                        <Input
                            id="platform"
                            placeholder="e.g., Zoom, Udemy, Coursera, etc."
                            value={form.platform}
                            onChange={(e) => handleInputChange('platform', e.target.value)}
                            disabled={isLoading}
                            className={fieldErrors.platform ? "border-red-500" : ""}
                        />
                        {fieldErrors.platform && (
                            <p className="text-sm text-red-500">{fieldErrors.platform}</p>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe the training objectives, topics covered, and expected outcomes..."
                        value={form.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        disabled={isLoading}
                        className={fieldErrors.description ? "border-red-500" : ""}
                    />
                    {fieldErrors.description && (
                        <p className="text-sm text-red-500">{fieldErrors.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            disabled={isLoading}
                            className={fieldErrors.startDate ? "border-red-500" : ""}
                        />
                        {fieldErrors.startDate && (
                            <p className="text-sm text-red-500">{fieldErrors.startDate}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date *</Label>
                        <Input
                            id="endDate"
                            type="date"
                            value={form.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            disabled={isLoading}
                            className={fieldErrors.endDate ? "border-red-500" : ""}
                        />
                        {fieldErrors.endDate && (
                            <p className="text-sm text-red-500">{fieldErrors.endDate}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={validateAndSubmit}
                        disabled={isLoading}
                        className="min-w-32"
                    >
                        {isLoading ? "Creating..." : "Create Training"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}