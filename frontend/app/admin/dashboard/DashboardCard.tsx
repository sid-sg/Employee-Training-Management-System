"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DashboardCard({
    title,
    icon,
    value,
    href,
}: {
    title: string
    icon: React.ReactNode
    value: number
    href: string
}) {
    const router = useRouter()

    return (
        <div
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => router.push(href)}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                </CardContent>
            </Card>
        </div>
    )
}
