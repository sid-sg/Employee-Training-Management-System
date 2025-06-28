"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import TrainingCard from "./ TrainingCard"
import Navbar from "@/components/navbar"

interface Training {
  id: string
  title: string
  mode: "ONLINE" | "OFFLINE"
  startDate: string
  endDate: string
  location?: string
  totalRating?: number;
  totalParticipants?: number;
}

export default function HRAdminDashboard() {
  const [trainings, setTrainings] = useState<Training[]>()
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userRole")
    if (userType !== "HR_ADMIN") {
      router.push("/")
      return
    }

    const fetchTrainings = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/api/training", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch trainings")
        const data = await res.json()
        setTrainings(data.trainings)
      } catch (error) {
        console.error("Error fetching trainings:", error)
      }
    }

    fetchTrainings()
  }, [router])

  // Filter trainings based on current date
  const { activeTrainings, pastTrainings } = useMemo(() => {
    if (!trainings) return { activeTrainings: [], pastTrainings: [] }
    
    const now = new Date()
    const active: Training[] = []
    const past: Training[] = []

    trainings.forEach(training => {
      const endDate = new Date(training.endDate)
      if (endDate >= now) {
        active.push(training)
      } else {
        past.push(training)
      }
    })

    return { activeTrainings: active, pastTrainings: past }
  }, [trainings])

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="HR_ADMIN" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Active Trainings ({activeTrainings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Past Trainings ({pastTrainings.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Trainings */}
          <TabsContent value="active">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Active Trainings</h2>
              <Button asChild>
                <Link href="/hr_admin/create-training" rel="noopener noreferrer">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Training
                </Link>
              </Button>
            </div>

            {activeTrainings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Trainings</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    There are currently no active trainings. Create a new training to get started.
                  </p>
                  <Button asChild>
                    <Link href="/hr_admin/create-training">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Training
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeTrainings.map((training) => (
                  <TrainingCard
                    key={training.id}
                    training={training}
                    onDelete={(id) => setTrainings((prev) => (prev ?? []).filter((t) => t.id !== id))}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Past Trainings */}
          <TabsContent value="past">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Past Trainings</h2>
            </div>

            {pastTrainings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Past Trainings</h3>
                  <p className="text-muted-foreground text-center">
                    No completed trainings found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastTrainings.map((training) => (
                  <TrainingCard
                    key={training.id}
                    training={training}
                    onDelete={(id) => setTrainings((prev) => (prev ?? []).filter((t) => t.id !== id))}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}