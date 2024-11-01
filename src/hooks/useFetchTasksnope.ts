import { useState, useEffect } from "react";
import { Task } from "../entities/useTask"; // Import Task type

const useFetchTasks = (url?: string): { data: Task[]; loading: boolean; error: string | null } => {
    const [data, setData] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = url ? `http://localhost:5001/api/check-content?url=${encodeURIComponent(url)}` : "http://localhost:3000/api/tasks";
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Network response was not ok");

                const result: Task[] = await response.json();
                if (result.length === 0) setError("No tasks found.");
                else setData(result);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetchTasks;
