import { Card } from "@/components/ui/Card";

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <Card className="p-12">
                <h1 className="text-3xl font-bold text-primary-red mb-4">{title}</h1>
                <p className="text-gray-500">This feature is coming soon.</p>
            </Card>
        </div>
    );
}
