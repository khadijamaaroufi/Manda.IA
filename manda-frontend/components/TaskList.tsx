"use client";

import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/tasks")
      .then((res) => res.json())
      .then((data: Task[]) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <ul className="max-w-md mx-auto mt-8">
      {tasks.map((task) => (
        <TaskItem key={task.id} title={task.title} done={task.done} />
      ))}
    </ul>
  );
}