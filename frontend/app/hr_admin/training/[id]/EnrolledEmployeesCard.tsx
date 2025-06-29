import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Users2, Mail, Phone, Search, X, Check, UserPlus, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import axios from "@/utils/axios";
import { toast } from "sonner";
import FeedbacksCard from "./FeedbacksCard";

interface Employee {
    id: string;
    name: string;
    employeeid: string;
    email: string;
    department: string;
    phonenumber?: string;
}

export default function EnrolledEmployeesCard({
    enrolledUsers,
    trainingId,
    refreshData,
    trainingTitle
}: {
    enrolledUsers: Employee[],
    trainingId: string,
    refreshData: () => void,
    trainingTitle: string
}) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    // New enrollment states
    const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isDeenrolling, setIsDeenrolling] = useState(false);

    // Ref for search input to maintain focus
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Memoize enrolled user IDs to prevent unnecessary re-renders
    const enrolledUserIds = useMemo(() =>
        enrolledUsers.map(user => user.id),
        [enrolledUsers]
    );

    // Memoize the search input to prevent re-renders
    const searchInput = useMemo(() => (
        <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search employees by name, email, department, or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
                disabled={isLoadingEmployees || isEnrolling}
                ref={searchInputRef}
            />

            {searchQuery && (
                <X
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() => setSearchQuery("")}
                />
            )}
        </div>
    ), [searchQuery, isLoadingEmployees, isEnrolling]);

    // Search employees using the search API
    const searchEmployees = useCallback(async (query: string) => {
        if (!query.trim()) {
            setAvailableEmployees([]);
            return;
        }

        setIsLoadingEmployees(true);
        try {
            const response = await axios.get("http://localhost:3000/api/user/search", {
                withCredentials: true,
                params: { q: query },
            });

            const allEmployees = response.data.users || [];

            // Filter out enrolled users at the time of search
            const available = allEmployees.filter(
                (employee: Employee) => !enrolledUserIds.includes(employee.id)
            );

            setAvailableEmployees(available);
        } catch (error) {
            console.error("Failed to search employees:", error);
            toast.error("Failed to search employees");
            setAvailableEmployees([]);
        } finally {
            setIsLoadingEmployees(false);
        }
    }, [enrolledUserIds]); // Use enrolledUserIds instead of enrolledUsers

    // Handle search query changes with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchEmployees(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handle employee selection for enrollment
    const handleEmployeeSelect = useCallback((employee: Employee) => {
        setSelectedEmployees(prev => {
            if (prev.find(emp => emp.id === employee.id)) {
                return prev; // Already selected, don't add again
            }
            return [...prev, employee];
        });
    }, []);

    const handleEmployeeRemove = useCallback((employeeId: string) => {
        setSelectedEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    }, []);

    // Handle enrollment
    const handleEnroll = async () => {
        if (selectedEmployees.length === 0) {
            toast.error("No employees selected for enrollment");
            return;
        }

        setIsEnrolling(true);
        try {
            await axios.post(`http://localhost:3000/api/training/${trainingId}/enroll`, {
                userIds: selectedEmployees.map(emp => emp.id)
            }, {
                withCredentials: true
            });

            toast.success(`${selectedEmployees.length} employee(s) enrolled successfully!`);
            setSelectedEmployees([]);
            setSearchQuery("");
            setAvailableEmployees([]);
            refreshData(); // Refresh enrolled users list
        } catch (error) {
            console.error("Failed to enroll employees:", error);
            toast.error("Failed to enroll employees");
        } finally {
            setIsEnrolling(false);
        }
    };

    // Handle select all toggle
    const handleSelectAllToggle = useCallback((checked: boolean) => {
        setSelectAllChecked(checked);
        if (checked) {
            setSelectedUsers(enrolledUsers.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    }, [enrolledUsers]);

    // Handle individual user selection
    const handleUserSelect = useCallback((userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
            setSelectAllChecked(false);
        }
    }, []);

    // Handle de-enrollment
    const handleDeenroll = async () => {
        if (selectedUsers.length === 0) {
            toast.error("No employees selected for de-enrollment");
            return;
        }

        setIsDeenrolling(true);
        try {
            await axios.post(`http://localhost:3000/api/training/${trainingId}/deenroll`, {
                userIds: selectedUsers
            }, {
                withCredentials: true
            });

            toast.success(`${selectedUsers.length} employee(s) de-enrolled successfully!`);
            setSelectedUsers([]);
            setSelectAllChecked(false);
            refreshData(); // Refresh enrolled users list
        } catch (error) {
            console.error("Failed to de-enroll employees:", error);
            toast.error("Failed to de-enroll employees");
        } finally {
            setIsDeenrolling(false);
        }
    };

    // Update select all checkbox state when individual selections change
    useEffect(() => {
        if (selectedUsers.length === 0) {
            setSelectAllChecked(false);
        } else if (selectedUsers.length === enrolledUsers.length) {
            setSelectAllChecked(true);
        }
    }, [selectedUsers.length, enrolledUsers.length]);

    return (
        <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-card">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Users2 className="h-6 w-6 text-primary" />
                    Employee Management
                </CardTitle>
                <CardDescription>
                    Manage enrolled employees and enroll new employees to this training
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="enrolled" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="enrolled" className="flex items-center gap-2">
                            <Users2 className="h-4 w-4" />
                            Enrolled ({enrolledUsers.length})
                        </TabsTrigger>
                        <TabsTrigger value="enroll" className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Enroll New
                        </TabsTrigger>
                        <TabsTrigger value="feedbacks" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Feedbacks
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="enrolled" className="space-y-4 mt-6">
                        {enrolledUsers.length > 0 ? (
                            <>
                                {/* Select All Checkbox */}
                                <div className="flex items-center gap-2 pb-2">
                                    <Checkbox
                                        checked={selectAllChecked}
                                        onCheckedChange={(checked) => handleSelectAllToggle(checked as boolean)}
                                        disabled={isDeenrolling}
                                    />
                                    <span className="text-sm font-medium">
                                        Select All {selectedUsers.length > 0 && `(${selectedUsers.length}/${enrolledUsers.length})`}
                                    </span>
                                </div>

                                {/* List of Enrolled Employees with Checkboxes */}
                                <div className="space-y-2">
                                    {enrolledUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className={cn(
                                                "p-4 border rounded-md flex items-center gap-4 bg-accent/30 dark:bg-accent/20 transition-colors",
                                                selectedUsers.includes(user.id) && "bg-accent/50 dark:bg-accent/40"
                                            )}
                                        >
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                                                disabled={isDeenrolling}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-medium truncate">{user.name}</p>
                                                            <Badge variant="outline" className="text-xs shrink-0">
                                                                {user.employeeid}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground truncate">{user.department}</p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-4 w-4 shrink-0" />
                                                            <span className="truncate">{user.email}</span>
                                                        </div>
                                                        {user.phonenumber && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="h-4 w-4 shrink-0" />
                                                                <span>{user.phonenumber}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* De-enroll Button */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeenroll}
                                        disabled={selectedUsers.length === 0 || isDeenrolling}
                                        className="min-w-32"
                                    >
                                        {isDeenrolling ? "De-enrolling..." : `De-enroll Selected (${selectedUsers.length})`}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Users2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No employees enrolled in this training.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="enroll" className="space-y-6 mt-6">
                        {/* Search Bar */}
                        {searchInput}

                        {/* Selected Employees for Enrollment */}
                        {selectedEmployees.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm font-medium">Selected Employees ({selectedEmployees.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEmployees.map((employee) => (
                                        <Badge key={employee.id} variant="secondary" className="px-3 py-1">
                                            <span className="mr-2">{employee.name}</span>
                                            <button
                                                onClick={() => handleEmployeeRemove(employee.id)}
                                                className="hover:text-destructive transition-colors"
                                                disabled={isEnrolling}
                                                aria-label={`Remove ${employee.name}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Employees List */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium">Available Employees</p>
                            <div className="max-h-96 overflow-y-auto border rounded-md">
                                {isLoadingEmployees ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-muted-foreground">Searching employees...</p>
                                    </div>
                                ) : availableEmployees.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">
                                            {searchQuery ? "No employees found matching your search." : "Start typing to search for employees to enroll."}
                                        </p>
                                    </div>
                                ) : (
                                    availableEmployees.map((employee) => {
                                        const isSelected = selectedEmployees.find((emp) => emp.id === employee.id);
                                        return (
                                            <div
                                                key={employee.id}
                                                className={cn(
                                                    "p-4 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50",
                                                    isSelected && "bg-muted cursor-default",
                                                    isEnrolling && "opacity-50 cursor-not-allowed"
                                                )}
                                                onClick={() => !isSelected && !isEnrolling && handleEmployeeSelect(employee)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <p className="font-medium truncate">{employee.name}</p>
                                                        <p className="text-sm text-muted-foreground">{employee.employeeid}</p>
                                                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                                            <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
                                                            <Badge variant="outline" className="text-xs shrink-0">
                                                                {employee.department}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {isSelected && <Check className="w-5 h-5 text-primary shrink-0" />}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Enroll Button */}
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleEnroll}
                                disabled={selectedEmployees.length === 0 || isEnrolling}
                                className="min-w-32"
                            >
                                {isEnrolling ? "Enrolling..." : `Enroll Employees (${selectedEmployees.length})`}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="feedbacks" className="space-y-6 mt-6">
                        <FeedbacksCard trainingId={trainingId} trainingTitle={trainingTitle} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}