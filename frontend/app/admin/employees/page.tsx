"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:3000/api/user/users?role=EMPLOYEE", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployees(res.data);
            } catch (error) {
                toast.error("Failed to fetch employees");
            }
        };
        fetchEmployees();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <Navbar role="ADMIN" />
            <h2 className="text-2xl font-bold mb-4 mt-6">All Employees</h2>
            {employees.map((emp: any) => (
                <Card key={emp.id} className="mb-4">
                    <CardHeader>
                        <CardTitle>{emp.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Email: {emp.email}</p>
                        <p>Department: {emp.department}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
