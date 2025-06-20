"use client"

import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Globe, BookOpenText } from "lucide-react"
import Navbar from "@/components/navbar"

export default function TrainingDetailPage() {
    const params = useParams()
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

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:3000/api/training/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    const trainingData = res.data.training[0]
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
                })
                .catch((err) => {
                    console.error("Failed to fetch training:", err)
                })
        }
    }, [id])

    return (
        <div>
            <Navbar role="HR_ADMIN" />
            <div className="max-w-2xl mx-auto mt-10 px-4 space-y-6">
                <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <BookOpenText className="h-6 w-6 text-primary" />
                            {training.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
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

                        <CardDescription className="mt-2 text-muted-foreground">
                            {training.description || "No description provided."}
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
