"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import TrainingCard from "./TrainingCard";

interface Training {
    id: string
    title: string
    mode: "ONLINE" | "OFFLINE"
    startDate: string
    endDate: string
    location?: string
    totalRating?: number;
    totalParticipants?: number;
}

export default function TrainingsPage() {
    const [trainings, setTrainings] = useState<Training[]>();

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:3000/api/training", {
                    headers: { withCredentials: true },
                });

                setTrainings(res.data.trainings);
            } catch (error) {
                toast.error("Failed to fetch Trainings");
            }
        };
        fetchTrainings();
    }, []);


    return (
        <div className="max-w-4xl mx-auto p-4">
            <Navbar role="ADMIN" />
            <h2 className="text-2xl font-bold mb-4">All Trainings</h2>
            <div className="grid gap-4">
                {(trainings ?? []).map((training) => (
                    <TrainingCard
                        key={training.id}
                        training={training}
                    />

                ))}
            </div>

        </div>
    );
}
