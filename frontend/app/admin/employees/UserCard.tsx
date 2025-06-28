import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Mail, Building, User, Phone } from "lucide-react"
import { UserDeleteAlert } from "./UserDeleteAlert"

interface User {
    id: string
    name: string
    employeeid: string
    email: string
    department: string
    phonenumber?: string
    role: "EMPLOYEE" | "HR_ADMIN"
}

interface UserCardProps {
    user: User
    onDelete: (id: string) => void
    onEdit: (user: User) => void
}

const UserCard = ({ user, onDelete, onEdit }: UserCardProps) => {
    return (
        <Card className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:bg-accent/40 dark:hover:bg-accent/20">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            {user.name}
                            <Badge variant={user.role === "HR_ADMIN" ? "default" : "secondary"}>
                                {user.role === "HR_ADMIN" ? "HR Admin" : "Employee"}
                            </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                            ID: {user.employeeid}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(user)
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>

                        <UserDeleteAlert
                            user={user}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{user.department}</span>
                    </div>
                    {user.phonenumber && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{user.phonenumber}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default UserCard 