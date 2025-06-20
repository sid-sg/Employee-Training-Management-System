"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar({ role }: { role: "HR_ADMIN" | "EMPLOYEE" | "ADMIN" }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear()
        router.push("/")
    };

    return (
        <header className="bg-card shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push(`/${role.toLowerCase()}/dashboard`)}>
                        <h1 className="text-xl font-extrabold cursor-pointer tracking-widest">TraininFlo</h1>
                    </button>
                </div>

                <nav className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => router.push(`/${role.toLowerCase()}/profile`)}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>

                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
