
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Calendar, MapPin, Globe, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Training {
    id: string
    title: string
    mode: "ONLINE" | "OFFLINE"
    startDate: string
    endDate: string
    location?: string
    platform?: string
    totalRating?: number;
    totalParticipants?: number;
}


const TrainingCard = ({ training }: { training: Training }) => {
    const router = useRouter()

    return (
        <Card
            key={training.id}
            className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:bg-accent/40 dark:hover:bg-accent/20"
            onClick={() => router.push(`/admin/trainings/${training.id}`)}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            {training.title}
                            <Badge variant={training.mode === "ONLINE" ? "default" : "secondary"}>
                                {training.mode}
                            </Badge>
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(training.startDate).toLocaleDateString()} to {new Date(training.endDate).toLocaleDateString()}
                        </span>
                    </div>
                    {training.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{training.location}</span>
                        </div>
                    )}
                    {training.platform && (
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>{training.platform}</span>
                        </div>
                    )}
                    {typeof training.totalRating === "number" && training.totalRating > 0 && (training.totalParticipants ?? 0) > 0 && (
                        <div className="flex items-center gap-2 text-sm mt-2 text-yellow-600 font-medium">
                            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-600" />
                            <span>{training.totalRating.toFixed(1)} / 5</span>
                            <span className="text-muted-foreground text-xs">({training.totalParticipants} participants)</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TrainingCard