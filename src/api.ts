import type { Task, TaskInput } from "./models/Task";

const API_URL = "http://localhost:3000/tasks";

/**
 * Fetch all tasks from the server
 */
export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

/**
 * Create a new task on the server
 */
export const createTask = async (task: TaskInput): Promise<Task> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
};

/**
 * Update an existing task on the server
 */
export const updateTask = async (task: Task): Promise<Task> => {
  const response = await fetch(`${API_URL}/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Task with id ${task.id} not found. The task may have been deleted or the server may need to be restarted.`
      );
    }
    throw new Error(
      `Failed to update task: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

/**
 * Delete a task from the server
 */
export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
};

/**
 * Get a single task by ID from the server
 */
export const getTaskById = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Task with id ${id} not found`);
    }
    throw new Error(
      `Failed to fetch task: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};
