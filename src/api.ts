import type { Task, TaskInput } from "./models/Task";

// API URLs
const LOCAL_API_URL = "http://localhost:3000/tasks";
const MOCK_API_URL = "https://69068a3cb1879c890ed787f3.mockapi.io/tasks/tasks";

// Determine which API to use
// In production (Vercel), use MockAPI
// In development, try localhost first, fallback to MockAPI
const getApiUrl = () => {
  // Check for environment variable override
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production, always use MockAPI
  if (import.meta.env.PROD || import.meta.env.MODE === "production") {
    return MOCK_API_URL;
  }

  // In development, use localhost (json-server)
  // If localhost fails, it will fallback to MockAPI
  return LOCAL_API_URL;
};

const API_URL = getApiUrl();

// Helper function to make API calls with fallback
const fetchWithFallback = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    // If localhost fails in development, fallback to MockAPI
    if (!response.ok && url === LOCAL_API_URL && !import.meta.env.PROD) {
      console.warn("Local server not available, using MockAPI fallback");
      return fetch(MOCK_API_URL, options);
    }
    return response;
  } catch (error) {
    // If fetch fails and we're using localhost, fallback to MockAPI
    if (url === LOCAL_API_URL && !import.meta.env.PROD) {
      console.warn("Local server not available, using MockAPI fallback");
      return fetch(MOCK_API_URL, options);
    }
    throw error;
  }
};

/**
 * Fetch all tasks from the server
 */
export const getTasks = async (): Promise<Task[]> => {
  const response = await fetchWithFallback(API_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  // Normalize IDs to numbers (MockAPI might return string IDs)
  return data.map((task: any) => ({
    ...task,
    id: typeof task.id === "string" ? parseInt(task.id) || task.id : task.id,
  }));
};

/**
 * Create a new task on the server
 */
export const createTask = async (task: TaskInput): Promise<Task> => {
  const response = await fetchWithFallback(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  const data = await response.json();
  // Normalize ID to number
  return {
    ...data,
    id: typeof data.id === "string" ? parseInt(data.id) || data.id : data.id,
  };
};

/**
 * Update an existing task on the server
 */
export const updateTask = async (task: Task): Promise<Task> => {
  const url = `${API_URL}/${task.id}`;
  const response = await fetchWithFallback(url, {
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
  const data = await response.json();
  // Normalize ID to number
  return {
    ...data,
    id: typeof data.id === "string" ? parseInt(data.id) || data.id : data.id,
  };
};

/**
 * Delete a task from the server
 */
export const deleteTask = async (id: number): Promise<void> => {
  const url = `${API_URL}/${id}`;
  const response = await fetchWithFallback(url, {
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
  const url = `${API_URL}/${id}`;
  const response = await fetchWithFallback(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Task with id ${id} not found`);
    }
    throw new Error(
      `Failed to fetch task: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  // Normalize ID to number
  return {
    ...data,
    id: typeof data.id === "string" ? parseInt(data.id) || data.id : data.id,
  };
};
