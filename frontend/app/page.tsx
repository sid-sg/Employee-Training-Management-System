"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "@/utils/axios" 
import type React from "react"

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/verify",{
          withCredentials: true
        }) 
        const userRole = res.data.user.role

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
            setIsCheckingAuth(false)
        }
      } catch (err) {
        setIsCheckingAuth(false) 
      }
    }

    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      }, {
        withCredentials: true
      })

      const userRole = response.data.user.role

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
          setError("Unknown user role")
      }
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking login status...</p>
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
