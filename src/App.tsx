import { useState } from "react";
import { useGetTasks } from "./hooks/useGetTasks";
import { useCreateTask } from "./hooks/useCreateTask";
import { useUpdateTask } from "./hooks/useUpdateTask";
import { useDeleteTask } from "./hooks/useDeleteTask";
import type { Task, TaskInput } from "./models/Task";
import { TaskBoard } from "./components/TaskBoard";
import { SearchBar } from "./components/SearchBar";
import { TaskForm } from "./components/TaskForm";
import { PlusIcon } from "./svgs/PlusIcon";

function App() {
  const { data: tasks = [], isLoading, error } = useGetTasks();
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const {
    mutate: updateTask,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dismissError, setDismissError] = useState(false);

  const handleCreateTask = (taskData: TaskInput) => {
    createTask(taskData, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleUpdateTask = (task: Task) => {
    updateTask(task, {
      onSuccess: () => {
        setEditingTask(null);
        setShowForm(false);
      },
      onError: () => {
        // Reset dismiss state when new error occurs
        setDismissError(false);
      },
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const handleSave = (taskData: TaskInput) => {
    if (editingTask) {
      handleUpdateTask({ ...taskData, id: editingTask.id } as Task);
    } else {
      handleCreateTask(taskData);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error loading tasks</h4>
          <p>
            {error instanceof Error ? error.message : "Failed to load tasks"}
          </p>
          <small>
            Make sure json-server is running on http://localhost:3000
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">MindLuster</h1>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <PlusIcon width={16} height={16} />
            <span>Add Task</span>
          </button>
        </div>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      <TaskBoard
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateTask={handleUpdateTask}
        searchTerm={searchTerm}
      />

      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
          isSubmitting={isCreating || isUpdating}
        />
      )}

      {updateError && !dismissError && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <div
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <strong>Warning:</strong>{" "}
            {updateError instanceof Error
              ? updateError.message
              : "Failed to update task"}
            <br />
            <small>
              Tasks list will refresh automatically to sync with server.
            </small>
            <button
              type="button"
              className="btn-close"
              onClick={() => setDismissError(true)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
