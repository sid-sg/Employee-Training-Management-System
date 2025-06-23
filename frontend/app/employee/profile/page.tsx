"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save } from "lucide-react";
import Navbar from "@/components/navbar";

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
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "EMPLOYEE") {
      router.push("/");
      return;
    }

    if (token) {
      axios
        .get(`http://localhost:3000/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setProfile({
            name: res.data.name,
            email: res.data.email,
            phonenumber: res.data.phonenumber ?? "",
            department: res.data.department,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
          setMessage("Failed to load profile.");
        });
    }
  }, [router, token]);

  const handlePhoneUpdate = () => {
    if (!token) return;

    axios
      .patch(
        "http://localhost:3000/api/user/update-phone",
        { phonenumber: profile.phonenumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setMessage("Phone number updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to update phone number.");
      });
  };

  const handlePasswordUpdate = () => {
    if (!token) return;

    if (passwords.new !== passwords.confirm) {
      setMessage("New passwords don't match!");
      return;
    }

    axios
      .patch(
        "http://localhost:3000/api/user/update-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setMessage("Password updated successfully!");
        setPasswords({ current: "", new: "", confirm: "" });
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to update password.");
      });
  };

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
