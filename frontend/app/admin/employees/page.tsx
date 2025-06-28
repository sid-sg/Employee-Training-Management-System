"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Plus } from "lucide-react";
import Navbar from "@/components/navbar";
import UserCard from "./UserCard";
import { EditUserDialog } from "./EditUserDialog";

interface User {
    id: string;
    name: string;
    employeeid: string;
    email: string;
    department: string;
    phonenumber?: string;
    role: "EMPLOYEE" | "HR_ADMIN";
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<User[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const filtered = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [employees, searchTerm]);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:3000/api/user/users?role=EMPLOYEE", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(res.data);
        } catch (error) {
            toast.error("Failed to fetch employees");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsEditDialogOpen(true);
    };

    const handleUpdate = (updatedUser: User) => {
        setEmployees(prev => prev.map(emp => emp.id === updatedUser.id ? updatedUser : emp));
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <Navbar role="ADMIN" />
            
            <div className="mt-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Employee Management</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search employees by name, ID, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="h-3 bg-muted rounded w-full"></div>
                                    <div className="h-3 bg-muted rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredEmployees.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {searchTerm ? "No employees found" : "No employees yet"}
                        </h3>
                        <p className="text-muted-foreground">
                            {searchTerm 
                                ? "Try adjusting your search terms" 
                                : "Employees will appear here once they are added to the system"
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEmployees.map((employee) => (
                        <UserCard
                            key={employee.id}
                            user={employee}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            <EditUserDialog
                user={editingUser}
                isOpen={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setEditingUser(null);
                }}
                onUpdate={handleUpdate}
            />
        </div>
    );
}
