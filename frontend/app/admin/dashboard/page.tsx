"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import axios from "@/utils/axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Users, BookOpen, UserPlus } from "lucide-react"
import Navbar from "@/components/navbar"
import DashboardCard from "./DashboardCard"
import { adminUserCreationSchema, adminFileUploadSchema } from "@/lib/validations/admin.validation"
import { AlertCircle } from "lucide-react"

interface CreateUserForm {
  name: string
  employeeid: string
  email: string
  department: string
  phonenumber: string
  role: "EMPLOYEE" | "HR_ADMIN"
}

function SuperAdminDashboard() {
  // Use File | null only after component mounts
  const [employeeFile, setEmployeeFile] = useState<File | null>(null)
  const [hrFile, setHrFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState("")
  const [stats, setStats] = useState({ totalEmployees: 0, totalHRAdmins: 0, totalActiveTrainings: 0 })
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [createUserForm, setCreateUserForm] = useState<CreateUserForm>({
    name: "",
    employeeid: "",
    email: "",
    department: "",
    phonenumber: "",
    role: "EMPLOYEE"
  })
  const [userFormErrors, setUserFormErrors] = useState<string[]>([])
  const [fileUploadErrors, setFileUploadErrors] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const checkAuthAndFetchData = async () => {
      try {
        // Check authentication
        const authRes = await axios.get("http://localhost:3000/api/auth/verify", {
          withCredentials: true
        })

        if (authRes.data.user.role !== "ADMIN") {
          router.push("/")
          return
        }

        // Fetch stats
        await fetchStats()
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router, isMounted])

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/stats", {
        withCredentials: true
      })
      setStats(res.data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      toast.error("Failed to load dashboard stats")
    }
  }

  const handleFileUpload = async (type: "employee" | "hr") => {
    setFileUploadErrors([])
    const file = type === "employee" ? employeeFile : hrFile
    if (!file) {
      setFileUploadErrors(["No file selected"])
      toast.error("No file selected")
      return
    }
    // Zod validation
    const result = adminFileUploadSchema.safeParse({ file })
    if (!result.success) {
      setFileUploadErrors(result.error.errors.map(e => e.message))
      toast.error("Please select a valid file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setUploadStatus(`Uploading ${type} data...`)

    try {
      const endpoint =
        type === "employee"
          ? "http://localhost:3000/api/admin/upload-employees"
          : "http://localhost:3000/api/admin/upload-hr-admins"

      const res = await axios.post(endpoint, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setUserFormErrors([])
    // Zod validation
    const result = adminUserCreationSchema.safeParse(createUserForm)
    if (!result.success) {
      setUserFormErrors(result.error.errors.map(e => e.message))
      toast.error("Please fix the errors in the form.")
      return
    }
    setIsCreatingUser(true)

    try {
      const endpoint = createUserForm.role === "EMPLOYEE"
        ? "http://localhost:3000/api/admin/upload-employees"
        : "http://localhost:3000/api/admin/upload-hr-admins"

      const res = await axios.post(endpoint, createUserForm, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })

      toast.success(`${createUserForm.role === "EMPLOYEE" ? "Employee" : "HR Admin"} created successfully!`)

      // Reset form
      setCreateUserForm({
        name: "",
        employeeid: "",
        email: "",
        department: "",
        phonenumber: "",
        role: "EMPLOYEE"
      })

      // Refresh stats
      fetchStats()
    } catch (error: any) {
      console.error("Create user error:", error)
      toast.error(error.response?.data?.error || "Failed to create user")
    } finally {
      setIsCreatingUser(false)
    }
  }

  const resetForm = () => {
    setCreateUserForm({
      name: "",
      employeeid: "",
      email: "",
      department: "",
      phonenumber: "",
      role: "EMPLOYEE"
    })
  }

  // Don't render until mounted to avoid hydration issues
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
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

        <Tabs defaultValue="create_user" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create_user" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create User
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Employees
            </TabsTrigger>
            <TabsTrigger value="hr_admins" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload HR Admins
            </TabsTrigger>
          </TabsList>

          {/* Create User Tab */}
          <TabsContent value="create_user">
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>Create a single user account. Password will be auto-generated and sent to the user's email.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Validation errors */}
                {userFormErrors.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {userFormErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={createUserForm.name}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeid">Employee ID *</Label>
                      <Input
                        id="employeeid"
                        value={createUserForm.employeeid}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, employeeid: e.target.value }))}
                        placeholder="Enter employee ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={createUserForm.email}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phonenumber">Phone Number</Label>
                      <Input
                        id="phonenumber"
                        value={createUserForm.phonenumber}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, phonenumber: e.target.value }))}
                        placeholder="Enter phone number (optional)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        value={createUserForm.department}
                        onChange={(e) => setCreateUserForm(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Enter department"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">User Role *</Label>
                      <Select
                        value={createUserForm.role}
                        onValueChange={(value: "EMPLOYEE" | "HR_ADMIN") => setCreateUserForm(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMPLOYEE">Employee</SelectItem>
                          <SelectItem value="HR_ADMIN">HR Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isCreatingUser} className="flex-1">
                      {isCreatingUser ? "Creating..." : "Create User"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isCreatingUser}>
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Employees Tab */}
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Upload Employee Data</CardTitle>
                <CardDescription>CSV with name, employeeid, email, department, phone required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Validation errors */}
                {fileUploadErrors.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {fileUploadErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
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

          {/* Upload HR Admins Tab */}
          <TabsContent value="hr_admins">
            <Card>
              <CardHeader>
                <CardTitle>Upload HR Admin Data</CardTitle>
                <CardDescription>CSV with name, employeeid, email, department, phone required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Validation errors */}
                {fileUploadErrors.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {fileUploadErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
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

// Export as dynamic component to prevent SSR
export default dynamic(() => Promise.resolve(SuperAdminDashboard), {
  ssr: false
})