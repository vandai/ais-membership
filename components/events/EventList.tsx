import { Event } from "@/types/event";
import EventCard from "./EventCard";

interface EventListProps {
    events: Event[];
}

export default function EventList({ events }: EventListProps) {
    if (events.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}
