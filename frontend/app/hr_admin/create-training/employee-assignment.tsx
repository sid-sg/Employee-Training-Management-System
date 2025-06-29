"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, X, Users, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { employeeAssignmentSchema, employeeSearchSchema, Employee } from "@/lib/validations/hr-admin.validation"
import { validateForm } from "@/lib/validations/form-utils"

interface EmployeeAssignmentProps {
    trainingTitle: string
    employees: Employee[]
    selectedEmployees: Employee[]
    onEmployeeSelect: (employee: Employee) => void
    onEmployeeRemove: (employeeId: string) => void
    onAssign: () => void
    searchQuery: string
    setSearchQuery: (value: string) => void
    isLoading?: boolean
}

export function EmployeeAssignment({
    trainingTitle,
    employees,
    selectedEmployees,
    onEmployeeSelect,
    onEmployeeRemove,
    onAssign,
    searchQuery,
    setSearchQuery,
    isLoading = false,
}: EmployeeAssignmentProps) {
    const [errors, setErrors] = useState<string[]>([]);

    const validateAndAssign = () => {
        // Clear previous errors
        setErrors([]);

        // Validate employee selection
        const employeeIds = selectedEmployees.map(emp => emp.id);
        const validation = validateForm(employeeAssignmentSchema, { employeeIds });
        
        if (!validation.success) {
            setErrors(validation.errors);
            return;
        }

        // If validation passes, call the assign function
        onAssign();
    };

    const handleSearchChange = (value: string) => {
        // Validate search query
        const searchValidation = validateForm(employeeSearchSchema, { query: value });
        
        if (searchValidation.success) {
            setSearchQuery(value);
        } else {
            // Still allow the search but show warning for very long queries
            if (value.length > 100) {
                setErrors(['Search query is too long']);
                return;
            }
            setSearchQuery(value);
        }
        
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Assign Employees
                </CardTitle>
                <CardDescription>
                    Select employees to participate in "{trainingTitle}"
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Validation errors */}
                {errors.length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errors.map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search employees by name, email, or department..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        maxLength={100}
                    />
                </div>

                {/* Selected Employees */}
                {selectedEmployees.length > 0 && (
                    <div className="space-y-3">
                        <Label>Selected Employees ({selectedEmployees.length})</Label>
                        <div className="flex flex-wrap gap-2">
                            {selectedEmployees.map((employee) => (
                                <Badge key={employee.id} variant="secondary" className="px-3 py-1">
                                    {employee.name}
                                    <button
                                        onClick={() => onEmployeeRemove(employee.id)}
                                        className="ml-2 hover:text-destructive"
                                        disabled={isLoading}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Employee List */}
                <div className="space-y-3">
                    <Label>Available Employees</Label>
                    <div className="max-h-96 overflow-y-auto space-y-2 border rounded-md">
                        {employees.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No employees found matching your search.
                            </p>
                        ) : (
                            employees.map((employee) => {
                                const isSelected = selectedEmployees.find((emp) => emp.id === employee.id)
                                return (
                                    <div
                                        key={employee.id}
                                        className={cn(
                                            "p-4 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50",
                                            isSelected && "bg-muted",
                                            isLoading && "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() => !isSelected && !isLoading && onEmployeeSelect(employee)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-medium">{employee.name}</p>
                                                <p className="text-sm text-muted-foreground">{employee.employeeid}</p>
                                                <div className="flex gap-2">
                                                <p className="text-sm text-muted-foreground">{employee.email}</p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {employee.department}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="w-5 h-5 text-primary" />}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={validateAndAssign}
                        disabled={selectedEmployees.length === 0 || isLoading}
                        className="min-w-32"
                    >
                        {isLoading ? "Assigning..." : `Assign Training (${selectedEmployees.length})`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
