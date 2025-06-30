"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import { trainingUpdateSchema, TrainingUpdateData } from "@/lib/validations/hr-admin.validation";
import { validateForm } from "@/lib/validations/form-utils";

export default function EditTrainingPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [form, setForm] = useState<TrainingUpdateData>({
        title: "",
        description: "",
        mode: undefined,
        location: "",
        platform: "",
        startDate: "",
        endDate: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                // Check authentication
                const authRes = await axios.get("http://localhost:3000/api/auth/verify", {
                    withCredentials: true
                })
                
                if (authRes.data.user.role !== "HR_ADMIN") {
                    router.push("/")
                    return
                }

                // Fetch training data
                if (id) {
                    const res = await axios.get(`http://localhost:3000/api/training/${id}`, {
                        withCredentials: true
                    });
                    
                    const training = res.data.training;

                    setForm({
                        title: training.title || "",
                        description: training.description || "",
                        mode: training.mode || undefined,
                        location: training.location || "",
                        platform: training.platform || "",
                        startDate: training.startDate ? new Date(training.startDate).toISOString().split('T')[0] : "",
                        endDate: training.endDate ? new Date(training.endDate).toISOString().split('T')[0] : "",
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                router.push("/");
            } finally {
                setIsAuthLoading(false);
                setIsLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [id, router]);

    const handleChange = (field: keyof TrainingUpdateData, value: string) => {
        // Clear field-specific error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
        
        setForm({ ...form, [field]: value });
    };

    const validateAndUpdate = async () => {
        // Clear previous errors
        setErrors([]);
        setFieldErrors({});

        // Filter out empty fields for validation
        const formData = Object.fromEntries(
            Object.entries(form).filter(([_, value]) => value !== "" && value !== undefined)
        );

        // Validate the form
        const validation = validateForm(trainingUpdateSchema, formData);
        
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

        // If validation passes, proceed with update
        try {
            await axios.patch(`http://localhost:3000/api/training/${id}`, formData, {
                withCredentials: true
            });
            alert("Training updated successfully");
            router.push("/hr_admin/dashboard");
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar role="HR_ADMIN" />
            <div className="max-w-xl mx-auto mt-10 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Edit Training</h2>

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
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Enter training title"
                        className={fieldErrors.title ? "border-red-500" : ""}
                    />
                    {fieldErrors.title && (
                        <p className="text-sm text-red-500">{fieldErrors.title}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Enter training description"
                        className={fieldErrors.description ? "border-red-500" : ""}
                    />
                    {fieldErrors.description && (
                        <p className="text-sm text-red-500">{fieldErrors.description}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="mode">Mode</Label>
                    <Select 
                        value={form.mode} 
                        onValueChange={(value) => handleChange('mode', value as "ONLINE" | "OFFLINE")}
                    >
                        <SelectTrigger className={fieldErrors.mode ? "border-red-500" : ""}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ONLINE">ONLINE</SelectItem>
                            <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                        </SelectContent>
                    </Select>
                    {fieldErrors.mode && (
                        <p className="text-sm text-red-500">{fieldErrors.mode}</p>
                    )}
                </div>

                {form.mode === "OFFLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={form.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            placeholder="Enter training location"
                            className={fieldErrors.location ? "border-red-500" : ""}
                        />
                        {fieldErrors.location && (
                            <p className="text-sm text-red-500">{fieldErrors.location}</p>
                        )}
                    </div>
                )}

                {form.mode === "ONLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Input
                            id="platform"
                            value={form.platform}
                            onChange={(e) => handleChange('platform', e.target.value)}
                            placeholder="Enter online platform"
                            className={fieldErrors.platform ? "border-red-500" : ""}
                        />
                        {fieldErrors.platform && (
                            <p className="text-sm text-red-500">{fieldErrors.platform}</p>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        value={form.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        type="date"
                        className={fieldErrors.startDate ? "border-red-500" : ""}
                    />
                    {fieldErrors.startDate && (
                        <p className="text-sm text-red-500">{fieldErrors.startDate}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        value={form.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        type="date"
                        className={fieldErrors.endDate ? "border-red-500" : ""}
                    />
                    {fieldErrors.endDate && (
                        <p className="text-sm text-red-500">{fieldErrors.endDate}</p>
                    )}
                </div>

                <Button onClick={validateAndUpdate} disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Training"}
                </Button>
            </div>
        </div>
    );
}