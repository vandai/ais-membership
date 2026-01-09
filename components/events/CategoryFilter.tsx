import { EventCategory } from "@/types/event";
import clsx from "clsx";

interface CategoryFilterProps {
    categories: EventCategory[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
}

export default function CategoryFilter({ categories, selectedId, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <button
                onClick={() => onSelect(null)}
                className={clsx(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all text-xs uppercase tracking-wide",
                    selectedId === null
                        ? "bg-primary-red text-white shadow-md shadow-red-900/10"
                        : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                )}
            >
                All Events
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.id)}
                    className={clsx(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all text-xs uppercase tracking-wide",
                        selectedId === category.id
                            ? "bg-primary-red text-white shadow-md shadow-red-900/10"
                            : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
