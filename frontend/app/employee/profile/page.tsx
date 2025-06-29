"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, AlertCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import { phoneNumberSchema, passwordUpdateSchema } from "@/lib/validations/employee.validation";
import { z } from "zod";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phonenumber: "",
    department: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        // Check authentication
        const authRes = await axios.get("http://localhost:3000/api/auth/verify", {
          withCredentials: true
        })
        
        if (authRes.data.user.role !== "EMPLOYEE") {
          router.push("/")
          return
        }

        // Fetch profile data
        const profileRes = await axios.get(`http://localhost:3000/api/user/me`, {
          withCredentials: true
        });
        
        setProfile({
          name: profileRes.data.name,
          email: profileRes.data.email,
          phonenumber: profileRes.data.phonenumber ?? "",
          department: profileRes.data.department,
        });
      } catch (error) {
        console.error("Error:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [router]);

  const handlePhoneUpdate = async () => {
    setPhoneError(null);
    setMessage("");
    // Validate phone number
    const result = phoneNumberSchema.safeParse({ phonenumber: profile.phonenumber });
    if (!result.success) {
      setPhoneError(result.error.errors[0].message);
      return;
    }
    try {
      await axios.patch(
        "http://localhost:3000/api/user/update-phone",
        { phonenumber: profile.phonenumber },
        {
          withCredentials: true
        }
      );
      setMessage("Phone number updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update phone number.");
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordErrors([]);
    setMessage("");
    // Validate passwords
    const result = passwordUpdateSchema.safeParse(passwords);
    if (!result.success) {
      setPasswordErrors(result.error.errors.map(e => e.message));
      return;
    }
    try {
      await axios.patch(
        "http://localhost:3000/api/user/update-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          withCredentials: true
        }
      );
      setMessage("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update password.");
    }
  };

  if (isLoading) {
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
      <Navbar role="EMPLOYEE" />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile.name} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phonenumber}
                  onChange={(e) => setProfile({ ...profile, phonenumber: e.target.value })}
                />
                {phoneError && (
                  <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{phoneError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={profile.department} disabled />
              </div>
              <Button onClick={handlePhoneUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Update Phone Number
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
              {passwordErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {passwordErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={handlePasswordUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Status Message */}
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  );
}
