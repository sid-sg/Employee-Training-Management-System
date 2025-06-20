import { useState } from "react";
import { Users2, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function EnrolledEmployeesCard({ enrolledUsers, trainingId, refreshData }: { enrolledUsers: any[], trainingId: string, refreshData: () => void }) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const handleSelectAllToggle = (checked: boolean) => {
        setSelectAllChecked(checked);
        if (checked) {
            setSelectedUsers(enrolledUsers.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleUserSelect = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        }
    };

    const handleDeenroll = async () => {
        console.log("De-enrolling users:", selectedUsers);
        
        if (selectedUsers.length === 0) {
            toast.error("No employees selected for de-enrollment");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:3000/api/training/${trainingId}/deenroll`,
                { userIds: selectedUsers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Selected employees de-enrolled successfully!");
            setSelectedUsers([]);
            setSelectAllChecked(false);
            refreshData(); // call parent’s refresh to fetch updated list
        } catch (error) {
            console.error(error);
            toast.error("Failed to de-enroll employees");
        }
    };

    return (
        <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
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

            {enrolledUsers.length > 0 && (
                <CardContent className="space-y-4">
                    {/* Select All Checkbox */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={selectAllChecked}
                            onCheckedChange={(checked) => handleSelectAllToggle(checked as boolean)}
                        />
                        <span className="text-sm">Select All</span>
                    </div>

                    {/* List of Employees with Checkboxes */}
                    {enrolledUsers.map((user) => (
                        <div
                            key={user.id}
                            className="p-3 border rounded-md flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-4 bg-accent/30 dark:bg-accent/20"
                        >
                            <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                            />
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

                    {/* De-enroll Button */}
                    <Button
                        variant="destructive"
                        onClick={handleDeenroll}
                        disabled={selectedUsers.length === 0}
                    >
                        De-enroll Selected
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}
