"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Edit, Trash2, Users, LogOut, User, Calendar, MapPin } from "lucide-react"

interface Training {
  id: string
  title: string
  type: "online" | "offline"
  description: string
  startDate: string
  endDate: string
  location?: string
  department: string[]
  assignedEmployees: string[]
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  phone: string
}

export default function HRAdminDashboard() {
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: "1",
      title: "Cybersecurity Awareness",
      type: "online",
      description: "Learn about cybersecurity best practices",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      department: ["IT", "Finance"],
      assignedEmployees: ["emp1", "emp2"],
    },
    {
      id: "2",
      title: "Leadership Workshop",
      type: "offline",
      description: "Develop leadership skills",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      location: "Conference Room A, Building 1",
      department: ["Management"],
      assignedEmployees: ["emp3"],
    },
  ])

  const [employees] = useState<Employee[]>([
    { id: "emp1", name: "John Doe", email: "john@company.com", department: "IT", phone: "123-456-7890" },
    { id: "emp2", name: "Jane Smith", email: "jane@company.com", department: "Finance", phone: "123-456-7891" },
    { id: "emp3", name: "Mike Johnson", email: "mike@company.com", department: "Management", phone: "123-456-7892" },
    { id: "emp4", name: "Sarah Wilson", email: "sarah@company.com", department: "IT", phone: "123-456-7893" },
  ])

  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [newTraining, setNewTraining] = useState({
    title: "",
    type: "online" as "online" | "offline",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  })

  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "hr-admin") {
      router.push("/")
    }
  }, [router])

  const departments = ["IT", "Finance", "Management", "HR", "Marketing"]

  const filteredEmployees =
    selectedDepartment === "All Departments"
      ? employees
      : employees.filter((emp) => emp.department === selectedDepartment)

  const handleCreateTraining = () => {
    const training: Training = {
      id: Date.now().toString(),
      ...newTraining,
      department: selectedDepartment === "All Departments" ? departments : [selectedDepartment],
      assignedEmployees: selectedEmployees,
    }
    setTrainings([...trainings, training])
    setNewTraining({
      title: "",
      type: "online",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
    })
    setSelectedEmployees([])
    setSelectedDepartment("All Departments")
  }

  const handleDeleteTraining = (id: string) => {
    setTrainings(trainings.filter((t) => t.id !== id))
  }

  const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId])
    } else {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId))
    }
  }

  const handleSelectAll = () => {
    const allEmployeeIds = filteredEmployees.map((emp) => emp.id)
    setSelectedEmployees(allEmployeeIds)
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">HR Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => router.push("/hr-admin/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="trainings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trainings">Manage Trainings</TabsTrigger>
            <TabsTrigger value="assign">Assign Trainings</TabsTrigger>
          </TabsList>

          <TabsContent value="trainings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Training Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Training
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Training</DialogTitle>
                    <DialogDescription>Add a new training program for employees</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Training Title</Label>
                      <Input
                        id="title"
                        value={newTraining.title}
                        onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                        placeholder="Enter training title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Training Type</Label>
                      <Select
                        value={newTraining.type}
                        onValueChange={(value: "online" | "offline") => setNewTraining({ ...newTraining, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTraining.description}
                        onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                        placeholder="Enter training description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newTraining.startDate}
                          onChange={(e) => setNewTraining({ ...newTraining, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newTraining.endDate}
                          onChange={(e) => setNewTraining({ ...newTraining, endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    {newTraining.type === "offline" && (
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newTraining.location}
                          onChange={(e) => setNewTraining({ ...newTraining, location: e.target.value })}
                          placeholder="Enter training location"
                        />
                      </div>
                    )}

                    <Button onClick={handleCreateTraining} className="w-full">
                      Create Training
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {trainings.map((training) => (
                <Card key={training.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {training.title}
                          <Badge variant={training.type === "online" ? "default" : "secondary"}>{training.type}</Badge>
                        </CardTitle>
                        <CardDescription>{training.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteTraining(training.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {training.startDate} to {training.endDate}
                        </span>
                      </div>
                      {training.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{training.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{training.assignedEmployees.length} employees assigned</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assign">
            <Card>
              <CardHeader>
                <CardTitle>Assign Training to Employees</CardTitle>
                <CardDescription>Filter employees by department and assign them to training programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Filter by Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Departments">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Employees</h3>
                    <Button variant="outline" onClick={handleSelectAll}>
                      Select All
                    </Button>
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
                </div>

                <div className="text-sm text-muted-foreground">{selectedEmployees.length} employee(s) selected</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
