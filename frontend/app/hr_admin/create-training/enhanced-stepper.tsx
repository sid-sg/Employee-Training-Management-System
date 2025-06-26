"use client"

import type * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StepProps {
    title: string
    description?: string
    isCompleted?: boolean
    isActive?: boolean
    icon?: React.ReactNode
}

const Step: React.FC<StepProps & { isLast?: boolean }> = ({
    title,
    description,
    isCompleted,
    isActive,
    isLast,
    icon
}) => {
    return (
        <div className="flex">
            <div className="flex flex-col items-center mr-4">
                <div
                    className={cn(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                        isCompleted
                            ? "border-primary bg-primary text-primary-foreground shadow-lg"
                            : isActive
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted-foreground/30 bg-background text-muted-foreground",
                    )}
                >
                    {isCompleted ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        icon || <span className="text-sm font-medium">{title.charAt(0)}</span>
                    )}
                </div>
                {!isLast && (
                    <div
                        className={cn(
                            "w-px h-16 mt-2 transition-colors duration-200",
                            isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                    />
                )}
            </div>
            <div className="pb-8 flex-1">
                <p className={cn(
                    "text-base font-semibold transition-colors duration-200",
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                    {title}
                </p>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    )
}

interface StepperProps {
    steps: Array<{ title: string; description?: string; icon?: React.ReactNode }>
    currentStep: number
}

export function EnhancedStepper({ steps, currentStep }: StepperProps) {
    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
                <CardDescription>Track your setup progress</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    {steps.map((step, index) => (
                        <Step
                            key={step.title}
                            title={step.title}
                            description={step.description}
                            icon={step.icon}
                            isCompleted={index < currentStep}
                            isActive={index === currentStep}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}