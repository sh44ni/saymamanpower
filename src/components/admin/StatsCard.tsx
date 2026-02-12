import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
}: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                        {description && (
                            <p className="text-sm text-gray-500 mt-1">{description}</p>
                        )}
                        {trend && (
                            <p
                                className={`text-sm mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {trend.isPositive ? "+" : ""}
                                {trend.value}% from last month
                            </p>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
