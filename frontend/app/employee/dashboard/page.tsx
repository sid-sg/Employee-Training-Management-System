"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Star, Calendar, MapPin, LogOut, User } from "lucide-react"

interface Training {
  id: string
  title: string
  type: "online" | "offline"
  description: string
  startDate: string
  endDate: string
  location?: string
  rating?: number
  completed: boolean
  certificateUploaded?: boolean
}

export default function EmployeeDashboard() {
  const [trainings] = useState<Training[]>([
    {
      id: "1",
      title: "Cybersecurity Awareness",
      type: "online",
      description: "Learn about cybersecurity best practices and protect company data",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      rating: 4,
      completed: true,
      certificateUploaded: true,
    },
    {
      id: "2",
      title: "Leadership Workshop",
      type: "offline",
      description: "Develop leadership skills and team management techniques",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      location: "Conference Room A, Building 1",
      completed: false,
    },
    {
      id: "3",
      title: "Data Analytics Course",
      type: "online",
      description: "Master data analysis tools and techniques",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
      completed: false,
    },
  ])

  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "employee") {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Employee Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => router.push("/employee/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">My Training Programs</h2>
          <p className="text-muted-foreground">View and manage your assigned training courses</p>
        </div>

        <div className="grid gap-6">
          {trainings.map((training) => (
            <Card key={training.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {training.title}
                      <Badge variant={training.type === "online" ? "default" : "secondary"}>{training.type}</Badge>
                      {training.completed && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Completed
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">{training.description}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => router.push(`/employee/training/${training.id}`)}>
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {training.startDate} to {training.endDate}
                    </span>
                  </div>
                  {training.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{training.location}</span>
                    </div>
                  )}
                  {training.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= training.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>({training.rating}/5)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
