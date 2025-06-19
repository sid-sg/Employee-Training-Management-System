import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Calendar, MapPin, Globe } from "lucide-react"
import Link from "next/link"
import { TrainingDeleteAlert } from "./TrainingDeleteAlert"

interface Training {
    id: string
    title: string
    mode: "ONLINE" | "OFFLINE"
    startDate: string
    endDate: string
    location?: string
    platform?: string
}


const TrainingCard = ({ training, onDelete }: { training: Training, onDelete: (id: string) => void }) => {
    return (
        <Card key={training.id} className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:bg-accent/40 dark:hover:bg-accent/20">
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
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/hr-admin/edit-training/${training.id}`} target="_blank" rel="noopener noreferrer">
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>

                        <TrainingDeleteAlert
                            key={training.id}
                            training={training}
                            onDelete={onDelete}
                        />
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
                </div>
            </CardContent>
        </Card>
    )
}

export default TrainingCard