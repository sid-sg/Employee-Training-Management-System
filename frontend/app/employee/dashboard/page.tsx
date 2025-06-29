"use client";

import { useState, useEffect } from "react";
import axios from "@/utils/axios";
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Check authentication
        const authRes = await axios.get("http://localhost:3000/api/auth/verify", {
          withCredentials: true
        })
        
        if (authRes.data.user.role !== "EMPLOYEE") {
          router.push("/")
          return
        }

        // Fetch trainings
        await fetchTrainings()
      } catch (error) {
        console.error("Error:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router]);

  const fetchTrainings = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/user/enrolled-trainings`, {
        withCredentials: true
      }); 

      setTrainings(res.data.trainings);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      toast.error("Failed to load your trainings");
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
