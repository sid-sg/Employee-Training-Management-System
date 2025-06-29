"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/navbar";


export default function EditTrainingPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [form, setForm] = useState({
        title: "",
        description: "",
        mode: "",
        location: "",
        platform: "",
        startDate: "",
        endDate: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            try {
                // Check authentication
                const authRes = await axios.get("http://localhost:3000/api/auth/verify", {
                    withCredentials: true
                })
                
                if (authRes.data.user.role !== "HR_ADMIN") {
                    router.push("/")
                    return
                }

                // Fetch training data
                if (id) {
                    const res = await axios.get(`http://localhost:3000/api/training/${id}`, {
                        withCredentials: true
                    });
                    
                    const training = res.data.training[0];

                    setForm({
                        title: training.title || "",
                        description: training.description || "",
                        mode: training.mode || "",
                        location: training.location || "",
                        platform: training.platform || "",
                        startDate: training.startDate ? new Date(training.startDate).toISOString().split('T')[0] : "",
                        endDate: training.endDate ? new Date(training.endDate).toISOString().split('T')[0] : "",
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                router.push("/");
            } finally {
                setIsAuthLoading(false);
                setIsLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.patch(`http://localhost:3000/api/training/${id}`, form, {
                withCredentials: true
            });
            alert("Training updated successfully");
            router.push("/hr_admin/dashboard");
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    if (isAuthLoading) {
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
        <div>
            <Navbar role="HR_ADMIN" />
            <div className="max-w-xl mx-auto mt-10 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Edit Training</h2>

                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter training title"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter training description"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="mode">Mode</Label>

                    <Select value={form.mode} onValueChange={(value) => setForm({ ...form, mode: value as "ONLINE" | "OFFLINE" })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ONLINE">ONLINE</SelectItem>
                            <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {form.mode === "OFFLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Enter training location"
                        />
                    </div>
                )}

                {form.mode === "ONLINE" && (
                    <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Input
                            id="platform"
                            name="platform"
                            value={form.platform}
                            onChange={handleChange}
                            placeholder="Enter online platform"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        type="date"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        type="date"
                    />
                </div>

                <Button onClick={handleUpdate}>Update Training</Button>
            </div>
        </div>
    );
}