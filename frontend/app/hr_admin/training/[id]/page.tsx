"use client"

import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Globe, BookOpenText, Users2, Mail, Phone } from "lucide-react"
import Navbar from "@/components/navbar"
import EnrolledEmployeesCard from "./EnrolledEmployeesCard"

interface User {
    id: string
    name: string
    email: string
    department: string
    phonenumber: string
}

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

    const [enrolledUsers, setEnrolledUsers] = useState<User[]>([])

    useEffect(() => {
        if (id) {
            // Fetch Training Details
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

            // Fetch Enrolled Users
            axios
                .get(`http://localhost:3000/api/training/${id}/enrolled-users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    setEnrolledUsers(res.data.users || [])
                })
                .catch((err) => {
                    console.error("Failed to fetch enrolled users:", err)
                })
        }
    }, [id])

    const fetchEnrolledUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:3000/api/training/${id}/enrolled-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEnrolledUsers(res.data.users);
        } catch (error) {
            console.error("Failed to fetch enrolled users:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchEnrolledUsers();
        }
    }, [id]);


    return (
        <div>
            <Navbar role="HR_ADMIN" />
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
                    </CardContent>
                </Card>

                {/* Enrolled Employees List */}
                {/* <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Users2 className="h-6 w-6 text-primary" />
                            Enrolled Employees
                        </CardTitle>
                        <CardDescription>
                            {enrolledUsers.length > 0
                                ? `${enrolledUsers.length} employee(s) enrolled`
                                : "No employees enrolled in this training."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {enrolledUsers.map((user) => (
                            <div
                                key={user.id}
                                className="p-3 border rounded-md flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-4 bg-accent/30 dark:bg-accent/20"
                            >
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.department}</p>
                                </div>
                                <div className="flex gap-4 items-center text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        {user.phone}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card> */}
                <EnrolledEmployeesCard enrolledUsers={enrolledUsers} trainingId={id} refreshData={fetchEnrolledUsers } />
            </div>
        </div>
    )
}
