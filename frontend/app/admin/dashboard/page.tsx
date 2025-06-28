"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Users, BookOpen } from "lucide-react"
import Navbar from "@/components/navbar"
import DashboardCard from "./DashboardCard"

export default function SuperAdminDashboard() {
  const [employeeFile, setEmployeeFile] = useState<File | null>(null)
  const [hrFile, setHrFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState("")
  const [stats, setStats] = useState({ totalEmployees: 0, totalHRAdmins: 0, totalActiveTrainings: 0 })
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "ADMIN") router.push("/")
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(res.data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      toast.error("Failed to load dashboard stats")
    }
  }

  const handleFileUpload = async (type: "employee" | "hr") => {
    const file = type === "employee" ? employeeFile : hrFile
    if (!file) return toast.error("No file selected")

    const formData = new FormData()
    formData.append("file", file)

    setUploadStatus(`Uploading ${type} data...`)

    try {
      const token = localStorage.getItem("token")
      const endpoint =
        type === "employee"
          ? "http://localhost:3000/api/admin/upload-employees"
          : "http://localhost:3000/api/admin/upload-hr-admins"

      const res = await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      })

      toast.success(`${type === "employee" ? "Employee" : "HR Admin"} data uploaded successfully!`)
      setUploadStatus(`${type} data uploaded successfully!`)
      type === "employee" ? setEmployeeFile(null) : setHrFile(null)
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.response?.data?.error || "File upload failed")
      setUploadStatus("File upload failed")
    }
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar role="ADMIN" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Employees"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            value={stats.totalEmployees}
            href="/admin/employees"
          />
          <DashboardCard
            title="Total HR Admins"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-user-icon lucide-shield-user h-4 w-4 text-muted-foreground"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M6.376 18.91a6 6 0 0 1 11.249.003" /><circle cx="12" cy="11" r="4" /></svg>}
            value={stats.totalHRAdmins}
            href="/admin/hr-admins"
          />
          <DashboardCard
            title="Total Active Trainings"
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            value={stats.totalEmployees}
            href="/admin/trainings"
          />


        </div>

        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Upload Employees</TabsTrigger>
            <TabsTrigger value="hr_admins">Upload HR Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Upload Employee Data</CardTitle>
                <CardDescription>CSV with name, employeeid, email, department, phone required</CardDescription>
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
                  <Upload className="h-4 w-4 mr-2" /> Upload Employee Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hr_admins">
            <Card>
              <CardHeader>
                <CardTitle>Upload HR Admin Data</CardTitle>
                <CardDescription>CSV with name, employeeid, email, department, phone required</CardDescription>
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
                  <Upload className="h-4 w-4 mr-2" /> Upload HR Admin Data
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