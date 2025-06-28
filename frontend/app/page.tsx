"use client"

import type React from "react"
import axios from "axios"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { GraduationCap } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const userRole = localStorage.getItem("userRole")

      if (token && userRole) {
        try {
          // Verify token is still valid by making a request to a protected endpoint
          await axios.get("http://localhost:3000/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` }
          })

          // Token is valid, redirect based on role
          switch (userRole) {
            case "ADMIN":
              router.push("/admin/dashboard")
              break
            case "HR_ADMIN":
              router.push("/hr_admin/dashboard")
              break
            case "EMPLOYEE":
              router.push("/employee/dashboard")
              break
            default:
              // Invalid role, clear storage and show login
              localStorage.removeItem("token")
              localStorage.removeItem("userEmail")
              localStorage.removeItem("userRole")
              setIsCheckingAuth(false)
          }
        } catch (error) {
          // Token is invalid, clear storage and show login
          localStorage.removeItem("token")
          localStorage.removeItem("userEmail")
          localStorage.removeItem("userRole")
          setIsCheckingAuth(false)
        }
      } else {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password
      }, {
        headers: { "Content-Type": "application/json" }
      })

      const data = response.data

      localStorage.setItem("token", data.token)
      localStorage.setItem("userEmail", data.user.email)
      localStorage.setItem("userRole", data.user.role)

      switch (data.user.role) {
        case "ADMIN":
          router.push("/admin/dashboard")
          break
        case "HR_ADMIN":
          router.push("/hr_admin/dashboard")
          break
        case "EMPLOYEE":
          router.push("/employee/dashboard")
          break
        default:
          setError("Unknown user role")
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        </div>
      </div>
    )
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
        </CardContent>
      </Card>
    </div>
  )
}
