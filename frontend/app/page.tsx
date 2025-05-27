"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap, Users, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate login logic
    try {
      // Mock authentication - replace with actual API call
      if (userType === "super-admin" && email === "admin@company.com" && password === "admin123") {
        localStorage.setItem("userType", "super-admin")
        localStorage.setItem("userEmail", email)
        router.push("/super-admin/dashboard")
      } else if (userType === "hr-admin" && email.includes("hr") && password === "hr123") {
        localStorage.setItem("userType", "hr-admin")
        localStorage.setItem("userEmail", email)
        router.push("/hr-admin/dashboard")
      } else if (userType === "employee" && password === "emp123") {
        localStorage.setItem("userType", "employee")
        localStorage.setItem("userEmail", email)
        router.push("/employee/dashboard")
      } else {
        setError("Invalid credentials or user type")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Training Management System</CardTitle>
          <CardDescription>Sign in to access your training portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Employee
                    </div>
                  </SelectItem>
                  <SelectItem value="hr-admin">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      HR Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="super-admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Super Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p>
                <strong>Super Admin:</strong> admin@company.com / admin123
              </p>
              <p>
                <strong>HR Admin:</strong> hr@company.com / hr123
              </p>
              <p>
                <strong>Employee:</strong> any email / emp123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
