"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Users, LogOut, User } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import TrainingCard from "./ TrainingCard"
import Navbar from "@/components/navbar"

interface Training {
  id: string
  title: string
  mode: "ONLINE" | "OFFLINE"
  startDate: string
  endDate: string
  location?: string
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  phone: string
}

export default function HRAdminDashboard() {
  const [trainings, setTrainings] = useState<Training[]>()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>("")
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)

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

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedDepartment || selectedDepartment === "All Departments") {
        setEmployees([]);
        return;
      }

      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:3000/api/user/users?role=EMPLOYEE&department=${selectedDepartment}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch employees")

        const data = await res.json()
        setEmployees(data)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    fetchEmployees()
  }, [selectedDepartment])

  const departments = ["IT", "Finance", "Management", "HR", "Civil", "Electrical", "Mechanical"]

  const filteredEmployees = employees ?? []

  const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId])
    } else {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId))
    }
  }

  const handleSelectAllToggle = (checked: boolean) => {
    setSelectAllChecked(checked);

    if (checked) {
      const allEmployeeIds = filteredEmployees.map((emp) => emp.id);
      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleAssignTraining = async () => {
    if (!selectedTrainingId || selectedEmployees.length === 0) {
      toast.error("Please select a training and at least one employee.")
      return
    }

    setIsAssigning(true)
    const token = localStorage.getItem("token")

    try {
      const response = await axios.post(
        `http://localhost:3000/api/training/${selectedTrainingId}/enroll`,
        { userIds: selectedEmployees },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 200 || response.status === 201) {
        toast.success(`Successfully assigned ${selectedEmployees.length} employee(s) to training!`)

        setSelectedEmployees([])
        setSelectAllChecked(false)
        setSelectedTrainingId("")
        setSelectedDepartment("")
      } else {
        throw new Error('Assignment failed')
      }

    } catch (error) {
      console.error("Assignment error:", error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Invalid request. Please check your selections.")
        } else if (error.response?.status === 401) {
          toast.error("Unauthorized. Please log in again.")
        } else if (error.response?.status === 404) {
          toast.error("Training or employees not found.")
        } else if ((error.response?.status ?? 0) >= 500) {
          toast.error("Server error. Please try again later.")
        } else {
          toast.error(error.response?.data?.message || "Failed to assign employees to training")
        }
      } else {
        toast.error("Network error. Please check your connection.")
      }
    } finally {
      setIsAssigning(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="HR_ADMIN" />


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="trainings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trainings">Manage Trainings</TabsTrigger>
            <TabsTrigger value="assign">Assign Trainings</TabsTrigger>
          </TabsList>

          {/* Create New Training */}
          <TabsContent value="trainings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Training Management System</h2>
              <Button asChild>
                <Link href="/hr_admin/create-training"  rel="noopener noreferrer">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Training
                </Link>
              </Button>
            </div>

            {/* List of Trainings */}
            <div className="grid gap-4">
              {(trainings ?? []).map((training) => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  onDelete={(id) => setTrainings((prev) => (prev ?? []).filter((t) => t.id !== id))}
                />

              ))}
            </div>
          </TabsContent>

          {/* Assign Training to Employees */}
          <TabsContent value="assign">
            <Card>
              <CardHeader>
                <CardTitle>Assign Training to Employees</CardTitle>
                <CardDescription>Select a training and assign employees filtered by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Training Selection */}
                <div className="space-y-2">
                  <Label htmlFor="training">Select Training</Label>
                  <Select
                    onValueChange={(value) => setSelectedTrainingId(value)}
                    value={selectedTrainingId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a training" />
                    </SelectTrigger>
                    <SelectContent>
                      {(trainings ?? []).map((training) => (
                        <SelectItem key={training.id} value={training.id}>
                          {training.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Filter */}
                <div className="space-y-2">
                  <Label htmlFor="department">Filter by Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Employee List */}
                {selectedTrainingId && (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Employees</h3>
                      <div className="flex items-center space-x-2">
                        <span>Select All</span>
                        <Checkbox
                          checked={selectAllChecked}
                          onCheckedChange={(checked) => handleSelectAllToggle(checked as boolean)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="flex items-center space-x-2 p-2 border rounded">
                          <Checkbox
                            id={employee.id}
                            checked={selectedEmployees.includes(employee.id)}
                            onCheckedChange={(checked) => handleEmployeeSelection(employee.id, checked as boolean)}
                          />
                          <label htmlFor={employee.id} className="flex-1 cursor-pointer">
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.email} • {employee.department}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-muted-foreground">{selectedEmployees.length} employee(s) selected</div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleAssignTraining}
                      disabled={isAssigning || !selectedTrainingId || selectedEmployees.length === 0}
                    >
                      {isAssigning ? "Assigning..." : "Assign to Training"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}