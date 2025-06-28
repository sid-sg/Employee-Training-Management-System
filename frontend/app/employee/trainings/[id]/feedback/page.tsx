"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Send } from "lucide-react"
import Navbar from "@/components/navbar"
import axios from "axios"
import { toast } from "sonner"

export default function TrainingFeedbackPage() {
    const params = useParams()
    const router = useRouter()
    const trainingId = params.id as string

    const [userInfo, setUserInfo] = useState({
        name: "",
        designation: "",
        department: ""
    })

    const [trainingFeedback, setTrainingFeedback] = useState({
        duration: "",
        pace: "",
        content: "",
        relevance: "",
        usefulness: "",
        confidence: ""
    })

    const [trainerFeedback, setTrainerFeedback] = useState({
        knowledge: "",
        explanation: "",
        answers: "",
        utility: "",
        information: ""
    })

    const [comments, setComments] = useState({
        trainingLikes: "",
        trainingImprovements: "",
        trainerStrengths: "",
        trainerRecommendations: ""
    })

    const [training, setTraining] = useState({
        title: "",
        mode: ""
    })

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "EMPLOYEE") {
            router.push("/");
            return;
        }
        if (!token) return;

        // Fetch user info and training details
        const fetchData = async () => {
            try {
                // Fetch user profile
                const userRes = await axios.get("http://localhost:3000/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setUserInfo({
                    name: userRes.data.name || "",
                    designation: "todo",
                    department: userRes.data.department || ""
                })

                // Fetch training details
                const trainingRes = await axios.get(`http://localhost:3000/api/training/${trainingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const trainingData = trainingRes.data.training[0]
                setTraining({
                    title: trainingData.title || "",
                    mode: trainingData.mode || ""
                })
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        if (trainingId) {
            fetchData()
        }
    }, [trainingId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const allRatings = [
            trainingFeedback.duration,
            trainingFeedback.pace,
            trainingFeedback.content,
            trainingFeedback.relevance,
            trainingFeedback.usefulness,
            trainingFeedback.confidence,
            trainerFeedback.knowledge,
            trainerFeedback.explanation,
            trainerFeedback.answers,
            trainerFeedback.utility,
            trainerFeedback.information
        ]

        const allFieldsFilled = allRatings.every(rating => rating !== "")

        if (!allFieldsFilled) {
            toast.error("Please provide ratings for all required questions.")
            return
        }

        const feedbackData = {
            trainingId,
            userInfo,
            trainingFeedback,
            trainerFeedback,
            comments,
            modeOfAttendance: training.mode === "ONLINE" ? "Video Conferencing" : "Direct Participation"
        }

        try {
            await axios.post(`http://localhost:3000/api/training/${trainingId}/feedback`, feedbackData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            toast.success("Your feedback has been submitted successfully.")
            router.push(`/employee/trainings/${trainingId}`)
        } catch (error) {
            console.error("Error submitting feedback:", error)
            toast.error("Error submitting feedback. Please try again.")
        }
    }


    const handleGoBack = () => {
        router.push(`/employee/trainings/${trainingId}`)
    }

    const ratingOptions = [
        { value: "5", label: "5 - Excellent" },
        { value: "4", label: "4 - Good" },
        { value: "3", label: "3 - Average" },
        { value: "2", label: "2 - Fair" },
        { value: "1", label: "1 - Poor" }
    ]

    const RatingSection = ({ title, value, onChange, name }: {
        title: string,
        value: string,
        onChange: (value: string) => void,
        name: string
    }) => (
        <div className="space-y-3">
            <Label className="text-sm font-medium">{title}</Label>
            <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-4">
                {ratingOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                        <Label htmlFor={`${name}-${option.value}`} className="text-sm cursor-pointer">
                            {option.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )

    return (
        <div>
            <Navbar role="EMPLOYEE" />
            <div className="max-w-4xl mx-auto mt-10 px-4 space-y-8 mb-10">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Training
                    </Button>
                    <h1 className="text-2xl font-bold">Training Feedback Form</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Fixed Input Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Participant Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={userInfo.name}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input
                                        id="designation"
                                        value={userInfo.designation}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        value={userInfo.department}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="mode">Mode of Attendance</Label>
                                    <Input
                                        id="mode"
                                        value={training.mode === "ONLINE" ? "Video Conferencing" : "Direct participation"}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Training Feedback Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Feedback Regarding Content and Structure of the Training</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Please select (✓) the rating for each section based on the following criteria:
                                <br />
                                5=excellent &nbsp;&nbsp; 4=good &nbsp;&nbsp; 3=average &nbsp;&nbsp; 2=fair &nbsp;&nbsp; 1=poor
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RatingSection
                                title="Duration of the Training was sufficient for me:"
                                value={trainingFeedback.duration}
                                onChange={(value) => setTrainingFeedback(prev => ({ ...prev, duration: value }))}
                                name="duration"
                            />

                            <RatingSection
                                title="Pace of the Training was sufficient in understanding the concepts:"
                                value={trainingFeedback.pace}
                                onChange={(value) => setTrainingFeedback(prev => ({ ...prev, pace: value }))}
                                name="pace"
                            />

                            <RatingSection
                                title="The Content / Course material was organized and easy to follow:"
                                value={trainingFeedback.content}
                                onChange={(value) => setTrainingFeedback(prev => ({ ...prev, content: value }))}
                                name="content"
                            />

                            <RatingSection
                                title="The topics covered were relevant to me:"
                                value={trainingFeedback.relevance}
                                onChange={(value) => setTrainingFeedback(prev => ({ ...prev, relevance: value }))}
                                name="relevance"
                            />

                            <RatingSection
                                title="This Training experience will be useful in my work:"
                                value={trainingFeedback.usefulness}
                                onChange={(value) => setTrainingFeedback(prev => ({ ...prev, usefulness: value }))}
                                name="usefulness"
                            />

                            <RatingSection
                                title="After attending the training, confident of imparting training to others:"
                                value={trainingFeedback.confidence}
                                onChange={(value) => setTrainingFeedback(prev => ({ ...prev, confidence: value }))}
                                name="confidence"
                            />

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="font-semibold">Open-ended comments</h4>
                                <div>
                                    <Label htmlFor="trainingLikes">What did you most like about the training?</Label>
                                    <Textarea
                                        id="trainingLikes"
                                        value={comments.trainingLikes}
                                        onChange={(e) => setComments(prev => ({ ...prev, trainingLikes: e.target.value }))}
                                        placeholder="Share what you enjoyed most about the training..."
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="trainingImprovements">What can be improved with regard to the structure, format, and/or materials?</Label>
                                    <Textarea
                                        id="trainingImprovements"
                                        value={comments.trainingImprovements}
                                        onChange={(e) => setComments(prev => ({ ...prev, trainingImprovements: e.target.value }))}
                                        placeholder="Suggest improvements for the training structure, format, or materials..."
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trainer Feedback Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Feedback Regarding Trainer</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Please select (✓) the rating for each section based on the following criteria:
                                <br />
                                5=excellent &nbsp;&nbsp; 4=good &nbsp;&nbsp; 3=average &nbsp;&nbsp; 2=fair &nbsp;&nbsp; 1=poor
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RatingSection
                                title="Knowledge of the subject matter:"
                                value={trainerFeedback.knowledge}
                                onChange={(value) => setTrainerFeedback(prev => ({ ...prev, knowledge: value }))}
                                name="knowledge"
                            />

                            <RatingSection
                                title="Ability to explain and illustrate concepts:"
                                value={trainerFeedback.explanation}
                                onChange={(value) => setTrainerFeedback(prev => ({ ...prev, explanation: value }))}
                                name="explanation"
                            />

                            <RatingSection
                                title="Ability to answer questions completely and satisfactorily:"
                                value={trainerFeedback.answers}
                                onChange={(value) => setTrainerFeedback(prev => ({ ...prev, answers: value }))}
                                name="answers"
                            />

                            <RatingSection
                                title="Overall utility of the Training imparted by the trainer:"
                                value={trainerFeedback.utility}
                                onChange={(value) => setTrainerFeedback(prev => ({ ...prev, utility: value }))}
                                name="utility"
                            />

                            <RatingSection
                                title="The usefulness of the information received in training:"
                                value={trainerFeedback.information}
                                onChange={(value) => setTrainerFeedback(prev => ({ ...prev, information: value }))}
                                name="information"
                            />

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="font-semibold">Open-ended comments</h4>
                                <div>
                                    <Label htmlFor="trainerStrengths">What specifically did the trainer do well?</Label>
                                    <Textarea
                                        id="trainerStrengths"
                                        value={comments.trainerStrengths}
                                        onChange={(e) => setComments(prev => ({ ...prev, trainerStrengths: e.target.value }))}
                                        placeholder="Highlight the trainer's strengths and what they did well..."
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="trainerRecommendations">What recommendations do you have for the trainer to improve?</Label>
                                    <Textarea
                                        id="trainerRecommendations"
                                        value={comments.trainerRecommendations}
                                        onChange={(e) => setComments(prev => ({ ...prev, trainerRecommendations: e.target.value }))}
                                        placeholder="Suggest areas where the trainer can improve..."
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" size="lg" className="w-full sm:w-auto">
                            <Send className="h-4 w-4 mr-2" />
                            Submit Feedback
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}