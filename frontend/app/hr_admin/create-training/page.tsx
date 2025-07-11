"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "@/utils/axios"
import { Calendar, Users } from "lucide-react"
import Navbar from "@/components/navbar"
import { EnhancedStepper } from "./enhanced-stepper"
import { TrainingForm } from "./training-form"
import { EmployeeAssignment } from "./employee-assignment"
import { TrainingFormData, Employee } from "@/lib/validations/hr-admin.validation"

export default function CreateTrainingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [createdTrainingId, setCreatedTrainingId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthLoading, setIsAuthLoading] = useState(true)
    const [employees, setEmployees] = useState<Employee[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])

    const [form, setForm] = useState<TrainingFormData>({
        title: "",
        mode: "OFFLINE",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        platform: "",
    })

    const router = useRouter()

    const steps = [
        {
            title: "Create Training",
            description: "Set up the basic training details and schedule",
            icon: <Calendar className="w-5 h-5" />,
        },
        {
            title: "Assign Employees",
            description: "Select employees who will participate in this training",
            icon: <Users className="w-5 h-5" />,
        },
    ]

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authRes = await axios.get("http://localhost:3000/api/auth/verify", {
                    withCredentials: true
                })
                
                if (authRes.data.user.role !== "HR_ADMIN") {
                    router.push("/")
                    return
                }
            } catch (error) {
                console.error("Auth error:", error)
                router.push("/")
            } finally {
                setIsAuthLoading(false)
            }
        }

        checkAuth()
    }, [router])

    const handleCreateTraining = async () => {
        setIsLoading(true)

        try {
            const response = await axios.post(
                "http://localhost:3000/api/training",
                form,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            setCreatedTrainingId(response.data.training.id)
            toast.success("Training created successfully")
            setCurrentStep(1)
        } catch (err) {
            toast.error("Error creating training")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAssignEmployees = async () => {
        if (selectedEmployees.length === 0) {
            toast.error("Please select at least one employee")
            return
        }

        setIsLoading(true)

        try {
            await axios.post(
                `http://localhost:3000/api/training/${createdTrainingId}/enroll`,
                { userIds: selectedEmployees.map((emp) => emp.id) },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            toast.success(`Training assigned to ${selectedEmployees.length} employees`)
            router.push("/hr_admin/dashboard")
        } catch (err) {
            toast.error("Error assigning employees")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmployeeSelect = (employee: Employee) => {
        if (!selectedEmployees.find((emp) => emp.id === employee.id)) {
            setSelectedEmployees([...selectedEmployees, employee])
        }
    }

    const handleEmployeeRemove = (employeeId: string) => {
        setSelectedEmployees(selectedEmployees.filter((emp) => emp.id !== employeeId))
    }

    useEffect(() => {
        if (searchQuery.trim() === "") return;

        const fetchEmployees = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/user/search", {
                    withCredentials: true,
                    params: { q: searchQuery },
                })
                setEmployees(res.data.users)
            } catch (err) {
                console.error("Error fetching employees:", err)
            }
        }

        const delay = setTimeout(fetchEmployees, 300)
        return () => clearTimeout(delay)
    }, [searchQuery])

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
        <div className="min-h-screen bg-background">
            <Navbar role="HR_ADMIN" />
            <div className="container max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create New Training</h1>
                    <p className="text-muted-foreground">Set up a training program and assign employees</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <EnhancedStepper steps={steps} currentStep={currentStep} />
                    </div>

                    <div className="lg:col-span-3">
                        {currentStep === 0 && (
                            <TrainingForm
                                form={form}
                                onFormChange={setForm}
                                onSubmit={handleCreateTraining}
                                isLoading={isLoading}
                            />
                        )}

                        {currentStep === 1 && (
                            <EmployeeAssignment
                                trainingTitle={form.title}
                                employees={employees}
                                selectedEmployees={selectedEmployees}
                                onEmployeeSelect={handleEmployeeSelect}
                                onEmployeeRemove={handleEmployeeRemove}
                                onAssign={handleAssignEmployees}
                                isLoading={isLoading}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
