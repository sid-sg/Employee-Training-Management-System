"use client"

import axios from "@/utils/axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Globe, BookOpenText, MessageSquare } from "lucide-react"
import Navbar from "@/components/navbar"

interface User {
    id: string
    name: string
    email: string
    department: string
    phonenumber: string
}

export default function TrainingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [training, setTraining] = useState({
        title: "",
        description: "",
        mode: "",
        location: "",
        platform: "",
        startDate: "",
        endDate: "",
    })

    const handleFeedbackClick = () => {
        router.push(`/employee/trainings/${id}/feedback`)
    }

    useEffect(() => {
        const checkAuthAndFetchTraining = async () => {
            try {
                // Check authentication
                const authRes = await axios.get("http://localhost:3000/api/auth/verify", {
                    withCredentials: true
                })
                
                if (authRes.data.user.role !== "EMPLOYEE") {
                    router.push("/")
                    return
                }

                // Fetch Training Details
                const res = await axios.get(`http://localhost:3000/api/training/${id}`, {
                    withCredentials: true,
                })
                
                const trainingData = res.data.training
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
            } catch (error) {
                console.error("Error:", error)
                router.push("/")
            }
        }

        if (id) {
            checkAuthAndFetchTraining()
        }
    }, [id, router])

    return (
        <div>
            <Navbar role="EMPLOYEE" />
            <div className="max-w-7xl mx-auto mt-10 px-4 space-y-8 mb-10">
                <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <BookOpenText className="h-7 w-7 text-primary" />
                            {training.title}
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

                        {/* Feedback Button */}
                        <div className="pt-4 border-t">
                            <Button
                                onClick={handleFeedbackClick}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Provide Training Feedback
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}