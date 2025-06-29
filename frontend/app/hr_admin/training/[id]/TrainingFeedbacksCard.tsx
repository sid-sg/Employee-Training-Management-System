import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Star, MessageSquare, Calendar, User, Building } from "lucide-react";
import axios from "@/utils/axios";
import { toast } from "sonner";

interface TrainingFeedback {
    id: string;
    participantName: string;
    department: string;
    modeOfAttendance: string;
    submittedAt: string;
    
    // Training Content & Structure Ratings
    durationRating: number;
    paceRating: number;
    contentRating: number;
    relevanceRating: number;
    usefulnessRating: number;
    confidenceRating: number;
    
    // Trainer Ratings
    trainerKnowledgeRating: number;
    trainerExplanationRating: number;
    trainerAnswersRating: number;
    trainerUtilityRating: number;
    trainerInformationRating: number;
    
    // Open-ended Comments
    trainingLikes: string;
    trainingImprovements: string;
    trainerStrengths: string;
    trainerRecommendations: string;
}

interface TrainingFeedbacksCardProps {
    trainingId: string;
    trainingTitle: string;
}

export default function TrainingFeedbacksCard({ trainingId, trainingTitle }: TrainingFeedbacksCardProps) {
    const [feedbacks, setFeedbacks] = useState<TrainingFeedback[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [averageRatings, setAverageRatings] = useState({
        training: 0,
        trainer: 0
    });

    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/training/${trainingId}/feedbacks`, {
                withCredentials: true
            });

            const feedbacksData = response.data.feedbacks || [];
            setFeedbacks(feedbacksData);

            // Calculate average ratings
            if (feedbacksData.length > 0) {
                const trainingRatings = feedbacksData.map((f: TrainingFeedback) => 
                    (f.durationRating + f.paceRating + f.contentRating + f.relevanceRating + f.usefulnessRating + f.confidenceRating) / 6
                );
                const trainerRatings = feedbacksData.map((f: TrainingFeedback) => 
                    (f.trainerKnowledgeRating + f.trainerExplanationRating + f.trainerAnswersRating + f.trainerUtilityRating + f.trainerInformationRating) / 5
                );

                setAverageRatings({
                    training: trainingRatings.reduce((a:number, b:number) => a + b, 0) / trainingRatings.length,
                    trainer: trainerRatings.reduce((a:number, b:number) => a + b, 0) / trainerRatings.length
                });
            }
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
            toast.error("Failed to fetch training feedbacks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [trainingId]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < Math.round(rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                }`}
            />
        ));
    };

    const getRatingLabel = (rating: number) => {
        if (rating >= 4.5) return "Excellent";
        if (rating >= 4.0) return "Very Good";
        if (rating >= 3.5) return "Good";
        if (rating >= 3.0) return "Average";
        if (rating >= 2.5) return "Below Average";
        return "Poor";
    };

    if (isLoading) {
        return (
            <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        Training Feedbacks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2 text-muted-foreground">Loading feedbacks...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Training Feedbacks
                </CardTitle>
                <CardDescription>
                    {feedbacks.length > 0 
                        ? `${feedbacks.length} feedback(s) submitted for "${trainingTitle}"`
                        : "No feedbacks submitted yet for this training."
                    }
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {feedbacks.length > 0 && (
                    <>
                        {/* Overall Ratings Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    Training Content Rating
                                </h3>
                                <div className="flex items-center gap-2">
                                    {renderStars(averageRatings.training)}
                                    <span className="font-medium">
                                        {averageRatings.training.toFixed(1)}/5
                                    </span>
                                    <Badge variant="outline">
                                        {getRatingLabel(averageRatings.training)}
                                    </Badge>
                                </div>
                                <Progress value={(averageRatings.training / 5) * 100} className="h-2" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    Trainer Rating
                                </h3>
                                <div className="flex items-center gap-2">
                                    {renderStars(averageRatings.trainer)}
                                    <span className="font-medium">
                                        {averageRatings.trainer.toFixed(1)}/5
                                    </span>
                                    <Badge variant="outline">
                                        {getRatingLabel(averageRatings.trainer)}
                                    </Badge>
                                </div>
                                <Progress value={(averageRatings.trainer / 5) * 100} className="h-2" />
                            </div>
                        </div>

                        <Separator />

                        {/* Individual Feedbacks */}
                        <div className="space-y-6">
                            {feedbacks.map((feedback, index) => (
                                <div key={feedback.id} className="border rounded-lg p-6 space-y-4">
                                    {/* Participant Info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{feedback.participantName}</h4>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {feedback.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(feedback.submittedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {feedback.modeOfAttendance}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    {/* Training Ratings */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h5 className="font-medium text-sm">Training Content & Structure</h5>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Duration</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.durationRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Pace</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.paceRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Content Quality</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.contentRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Relevance</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.relevanceRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Usefulness</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.usefulnessRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Confidence Building</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.confidenceRating)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h5 className="font-medium text-sm">Trainer Performance</h5>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Knowledge</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.trainerKnowledgeRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Explanation Skills</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.trainerExplanationRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Answering Questions</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.trainerAnswersRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Utility</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.trainerUtilityRating)}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Information Provided</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(feedback.trainerInformationRating)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Comments */}
                                    <div className="space-y-4">
                                        <h5 className="font-medium text-sm">Comments & Suggestions</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {feedback.trainingLikes && (
                                                <div className="space-y-2">
                                                    <h6 className="text-sm font-medium text-green-600">What I liked about the training:</h6>
                                                    <p className="text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-md">
                                                        {feedback.trainingLikes}
                                                    </p>
                                                </div>
                                            )}
                                            {feedback.trainingImprovements && (
                                                <div className="space-y-2">
                                                    <h6 className="text-sm font-medium text-orange-600">Areas for improvement:</h6>
                                                    <p className="text-sm bg-orange-50 dark:bg-orange-950/20 p-3 rounded-md">
                                                        {feedback.trainingImprovements}
                                                    </p>
                                                </div>
                                            )}
                                            {feedback.trainerStrengths && (
                                                <div className="space-y-2">
                                                    <h6 className="text-sm font-medium text-blue-600">Trainer strengths:</h6>
                                                    <p className="text-sm bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                                                        {feedback.trainerStrengths}
                                                    </p>
                                                </div>
                                            )}
                                            {feedback.trainerRecommendations && (
                                                <div className="space-y-2">
                                                    <h6 className="text-sm font-medium text-purple-600">Trainer recommendations:</h6>
                                                    <p className="text-sm bg-purple-50 dark:bg-purple-950/20 p-3 rounded-md">
                                                        {feedback.trainerRecommendations}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {feedbacks.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Feedbacks Yet</h3>
                        <p className="text-muted-foreground">
                            No feedback has been submitted for this training yet.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 