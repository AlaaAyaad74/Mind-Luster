export type TaskColumn = "backlog" | "in-progress" | "review" | "done";

export interface Task {
  id: number;
  title: string;
  description: string;
  column: TaskColumn;
}

// Type for creating a new task (without id)
export type TaskInput = Omit<Task, "id">;

// Column configuration type
export interface ColumnConfig {
  id: TaskColumn;
  title: string;
}

// TaskCard Component Props
export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

// TaskColumn Component Props
export interface TaskColumnProps {
  title: string;
  columnId: TaskColumn;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
  itemsPerPage?: number;
}

// SortableTaskCard Component Props
export interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

// TaskBoard Component Props
export interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdateTask: (task: Task) => void;
  searchTerm: string;
}

// TaskForm Component Props
export interface TaskFormProps {
  task?: Task | null;
  onSave: (task: TaskInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
