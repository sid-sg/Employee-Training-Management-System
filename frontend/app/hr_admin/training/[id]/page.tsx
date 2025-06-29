"use client"

import axios from "@/utils/axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Globe, BookOpenText } from "lucide-react"
import Navbar from "@/components/navbar"
import EnrolledEmployeesCard from "./EnrolledEmployeesCard"

interface User {
    id: string
    name: string
    employeeid: string
    email: string
    department: string
    phonenumber: string
}

interface Training {
    title: string
    description: string
    mode: string
    location: string
    platform: string
    startDate: string
    endDate: string
}

export default function TrainingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [training, setTraining] = useState<Training>({
        title: "",
        description: "",
        mode: "",
        location: "",
        platform: "",
        startDate: "",
        endDate: "",
    })

    const [enrolledUsers, setEnrolledUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthLoading, setIsAuthLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

                // Fetch all data
                await fetchAllData()
            } catch (error) {
                console.error("Error:", error);
                router.push("/");
            } finally {
                setIsAuthLoading(false);
            }
        };

        if (id) {
            checkAuthAndFetchData();
        }
    }, [id, router]);

    const fetchTrainingDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/training/${id}`, {
                withCredentials: true
            })

            const trainingData = response.data.training[0]
            if (trainingData) {
                setTraining({
                    title: trainingData.title || "",
                    description: trainingData.description || "",
                    mode: trainingData.mode || "",
                    location: trainingData.location || "",
                    platform: trainingData.platform || "",
                    startDate: trainingData.startDate
                        ? new Date(trainingData.startDate).toLocaleDateString()
                        : "",
                    endDate: trainingData.endDate
                        ? new Date(trainingData.endDate).toLocaleDateString()
                        : "",
                })
            }
        } catch (err) {
            console.error("Failed to fetch training:", err)
            setError("Failed to fetch training details")
        }
    }

    const fetchEnrolledUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/training/${id}/enrolled-users`, {
                withCredentials: true
            })

            setEnrolledUsers(response.data.users || [])
        } catch (err) {
            console.error("Failed to fetch enrolled users:", err)
            // Don't set error here as training details might still be valid
        }
    }

    const fetchAllData = async () => {
        setIsLoading(true)
        setError(null)

        await Promise.all([
            fetchTrainingDetails(),
            fetchEnrolledUsers()
        ])

        setIsLoading(false)
    }

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

    if (isLoading) {
        return (
            <div>
                <Navbar role="HR_ADMIN" />
                <div className="max-w-7xl mx-auto mt-10 px-4">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-muted-foreground">Loading training details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <Navbar role="HR_ADMIN" />
                <div className="max-w-7xl mx-auto mt-10 px-4">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-destructive">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar role="HR_ADMIN" />
            <div className="max-w-7xl mx-auto mt-10 px-4 space-y-8 mb-10">
                <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <BookOpenText className="h-7 w-7 text-primary" />
                            {training.title || "Training Details"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-2 text-sm">
                            <Badge variant={training.mode === "ONLINE" ? "default" : "secondary"}>
                                {training.mode || "N/A"}
                            </Badge>
                        </div>

                        {(training.location || training.platform) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {training.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>{training.location}</span>
                                    </div>
                                )}
                                {training.platform && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <span>{training.platform}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                                {training.startDate && training.endDate
                                    ? `${training.startDate} to ${training.endDate}`
                                    : "Date not specified"}
                            </span>
                        </div>

                        <CardDescription className="mt-2 text-muted-foreground text-base">
                            {training.description || "No description provided."}
                        </CardDescription>
                    </CardContent>
                </Card>

                <EnrolledEmployeesCard
                    enrolledUsers={enrolledUsers}
                    trainingId={id}
                    refreshData={fetchEnrolledUsers}
                    trainingTitle={training.title}
                />
            </div>
        </div>
    )
}