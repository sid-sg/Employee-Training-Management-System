"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import TrainingCard from "./TrainingCard";

interface Training {
  id: string;
  title: string;
  mode: "ONLINE" | "OFFLINE";
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  platform?: string;
  totalRating?: number;
  totalParticipants?: number;
}


export default function EmployeeDashboard() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userType = localStorage.getItem("userRole");
    if (userType !== "EMPLOYEE") {
      router.push("/");
    } else {
      fetchTrainings();
    }
  }, []);

  const fetchTrainings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:3000/api/user/enrolled-trainings`, {
        headers: { Authorization: `Bearer ${token}` },
      }); 

      setTrainings(res.data.trainings);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      toast.error("Failed to load your trainings");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="EMPLOYEE" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">My Training Programs</h2>
        <div className="grid gap-4">
          {(trainings ?? []).map((training) => (
            <TrainingCard
              key={training.id}
              training={training}
            />

          ))}
        </div>
      </main>
    </div>
  );
}
