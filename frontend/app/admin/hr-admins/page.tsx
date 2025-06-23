"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";

export default function HRAdminsPage() {
    const [hrAdmins, setHRAdmins] = useState([]);

    useEffect(() => {
        const fetchHRAdmins = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:3000/api/user/users?role=HR_ADMIN", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHRAdmins(res.data);
            } catch (error) {
                toast.error("Failed to fetch HR Admins");
            }
        };
        fetchHRAdmins();
    }, []);

    return (
        
        <div className="max-w-7xl mx-auto p-4">
            <Navbar role="ADMIN" />
            <h2 className="text-2xl font-bold mb-4 mt-7">All HR Admins</h2>
            {hrAdmins.map((admin: any) => (
                <Card key={admin.id} className="mb-4">
                    <CardHeader>
                        <CardTitle>{admin.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Email: {admin.email}</p>
                        <p>Department: {admin.department}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
