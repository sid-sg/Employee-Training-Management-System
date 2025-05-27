"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Upload,
  ExternalLink,
  BookOpen,
  Target,
  Award,
  FileText,
} from "lucide-react"

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
  instructor: string
  duration: string
  maxParticipants?: number
  currentParticipants: number
  objectives: string[]
  prerequisites: string[]
  materials: string[]
  progress: number
}

export default function TrainingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const trainingId = params.id as string

  // Mock training data - in real app, fetch from API
  const [training] = useState<Training>({
    id: trainingId,
    title:
      trainingId === "1"
        ? "Cybersecurity Awareness"
        : trainingId === "2"
          ? "Leadership Workshop"
          : "Data Analytics Course",
    type: trainingId === "2" ? "offline" : "online",
    description:
      trainingId === "1"
        ? "Comprehensive cybersecurity training covering threat identification, password security, phishing awareness, and data protection best practices."
        : trainingId === "2"
          ? "Interactive leadership workshop focusing on team management, communication skills, and strategic decision-making."
          : "In-depth data analytics course covering statistical analysis, data visualization, and business intelligence tools.",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    location: trainingId === "2" ? "Conference Room A, Building 1, 123 Business Ave, City" : undefined,
    rating: trainingId === "1" ? 4 : undefined,
    completed: trainingId === "1",
    certificateUploaded: trainingId === "1",
    instructor: trainingId === "1" ? "Dr. Sarah Johnson" : trainingId === "2" ? "Michael Chen" : "Prof. David Wilson",
    duration: trainingId === "2" ? "3 days (24 hours)" : "4 weeks (self-paced)",
    maxParticipants: trainingId === "2" ? 25 : undefined,
    currentParticipants: trainingId === "2" ? 18 : 45,
    objectives: [
      trainingId === "1"
        ? "Identify common cybersecurity threats"
        : trainingId === "2"
          ? "Develop effective leadership communication"
          : "Master statistical analysis techniques",
      trainingId === "1"
        ? "Implement strong password policies"
        : trainingId === "2"
          ? "Learn team motivation strategies"
          : "Create compelling data visualizations",
      trainingId === "1"
        ? "Recognize phishing attempts"
        : trainingId === "2"
          ? "Practice conflict resolution"
          : "Build predictive models",
    ],
    prerequisites: trainingId === "3" ? ["Basic Excel knowledge", "Statistics fundamentals"] : [],
    materials: [
      "Training manual (PDF)",
      "Video lectures",
      trainingId === "1" ? "Security checklist" : trainingId === "2" ? "Leadership assessment tool" : "Dataset samples",
      "Quiz and assignments",
    ],
    progress: trainingId === "1" ? 100 : trainingId === "2" ? 0 : 35,
  })

  const [rating, setRating] = useState(training.rating || 0)
  const [feedback, setFeedback] = useState("")
  const [certificate, setCertificate] = useState<File | null>(null)

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "employee") {
      router.push("/")
    }
  }, [router])

  const handleRating = (newRating: number) => {
    setRating(newRating)
    // In a real app, this would update the backend
    console.log(`Rated training ${training.id} with ${newRating} stars`)
  }

  const handleCertificateUpload = () => {
    if (certificate) {
      console.log("Certificate uploaded:", certificate.name)
      setCertificate(null)
    }
  }

  const handleFeedbackSubmit = () => {
    console.log("Feedback submitted:", feedback)
    setFeedback("")
  }

  const openGoogleMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location)
    window.open(`https://maps.google.com?q=${encodedLocation}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Training Details</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">{training.title}</CardTitle>
                    <Badge variant={training.type === "online" ? "default" : "secondary"}>{training.type}</Badge>
                    {training.completed && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base">{training.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {training.startDate} to {training.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time Commitment</p>
                    <p className="text-sm text-muted-foreground">{training.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {training.currentParticipants}
                      {training.maxParticipants ? `/${training.maxParticipants}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Instructor</p>
                    <p className="text-sm text-muted-foreground">{training.instructor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Training Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{training.progress}%</span>
                </div>
                <Progress value={training.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {training.progress === 100
                    ? "Training completed successfully!"
                    : training.progress === 0
                      ? "Training not started yet"
                      : "Keep up the great work!"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Location Card (for offline training) */}
          {training.location && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Venue</p>
                      <p className="text-muted-foreground">{training.location}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => openGoogleMaps(training.location!)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {training.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {training.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {training.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Training Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {training.materials.map((material, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{material}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Access
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Rating and Feedback (for completed training) */}
          {training.completed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Rate & Review
                </CardTitle>
                <CardDescription>Share your experience with this training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Rate this training</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => handleRating(star)} className="p-1">
                        <Star
                          className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Current rating: {rating}/5 stars</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts about this training..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleFeedbackSubmit} disabled={!feedback.trim()}>
                    Submit Feedback
                  </Button>
                </div>

                {training.type === "online" && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="certificate">Upload Certificate</Label>
                      <div className="flex gap-2">
                        <Input
                          id="certificate"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                          className="flex-1"
                        />
                        <Button onClick={handleCertificateUpload} disabled={!certificate}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      {training.certificateUploaded && (
                        <p className="text-sm text-green-600">✓ Certificate uploaded successfully</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
