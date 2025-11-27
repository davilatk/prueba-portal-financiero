import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function KpiCard({ title, value, icon, description, colorClass }: {
    key: string;
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
    colorClass: string;
}) {
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-full ${colorClass}`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground pt-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}