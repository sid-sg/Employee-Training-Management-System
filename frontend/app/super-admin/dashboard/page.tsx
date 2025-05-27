"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { Upload, Users, UserCheck, LogOut, Settings } from "lucide-react"

export default function SuperAdminDashboard() {
  const [employeeFile, setEmployeeFile] = useState<File | null>(null)
  const [hrFile, setHrFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "super-admin") {
      router.push("/")
    }
  }, [router])

  const handleFileUpload = async (type: "employee" | "hr") => {
    const file = type === "employee" ? employeeFile : hrFile
    if (!file) return

    setUploadStatus(`Uploading ${type} data...`)

    // Simulate file upload
    setTimeout(() => {
      setUploadStatus(`${type} data uploaded successfully!`)
      if (type === "employee") setEmployeeFile(null)
      else setHrFile(null)
    }, 2000)
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
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Super Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HR Admins</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trainings</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">8 ending this week</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Upload Employees</TabsTrigger>
            <TabsTrigger value="hr-admins">Upload HR Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Upload Employee Data</CardTitle>
                <CardDescription>
                  Upload a CSV file containing employee information. Required columns: name, email, department, phone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-file">Employee CSV File</Label>
                  <Input
                    id="employee-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setEmployeeFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={() => handleFileUpload("employee")} disabled={!employeeFile} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Employee Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hr-admins">
            <Card>
              <CardHeader>
                <CardTitle>Upload HR Admin Data</CardTitle>
                <CardDescription>
                  Upload a CSV file containing HR admin information. Required columns: name, email, department, phone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hr-file">HR Admin CSV File</Label>
                  <Input
                    id="hr-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setHrFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={() => handleFileUpload("hr")} disabled={!hrFile} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload HR Admin Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {uploadStatus && (
          <Alert className="mt-4">
            <AlertDescription>{uploadStatus}</AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}
