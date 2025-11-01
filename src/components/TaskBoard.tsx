import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DndContextProps } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type {
  Task,
  TaskColumn,
  TaskBoardProps,
  ColumnConfig,
} from "../models/Task";
import { TaskColumn as TaskColumnComponent } from "./TaskColumn";

// Extract event types from DndContext props
type DragStartEvent = Parameters<
  NonNullable<DndContextProps["onDragStart"]>
>[0];
type DragEndEvent = Parameters<NonNullable<DndContextProps["onDragEnd"]>>[0];
type DragOverEvent = Parameters<NonNullable<DndContextProps["onDragOver"]>>[0];

const COLUMNS: ColumnConfig[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export const TaskBoard = ({
  tasks,
  onEdit,
  onDelete,
  onUpdateTask,
  searchTerm,
}: TaskBoardProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.column === column.id);
      return acc;
    }, {} as Record<TaskColumn, Task[]>);
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Handler for drag over events (can be used for visual feedback)
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Find target column
    let targetColumn: TaskColumn | null = null;

    // Check if dropped on a column
    if (typeof over.id === "string") {
      const column = COLUMNS.find((col) => col.id === over.id);
      if (column) {
        targetColumn = column.id;
      }
    } else {
      // Dropped on a task - find its column
      const targetTask = tasks.find((t) => t.id === over.id);
      if (targetTask) {
        targetColumn = targetTask.column;
      }
    }

    // Update task if column changed
    if (targetColumn && targetColumn !== activeTask.column) {
      onUpdateTask({
        ...activeTask,
        column: targetColumn,
      });
    }
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="row">
        {COLUMNS.map((column) => (
          <TaskColumnComponent
            key={column.id}
            title={column.title}
            columnId={column.id}
            tasks={tasksByColumn[column.id] || []}
            onEdit={onEdit}
            onDelete={onDelete}
            searchTerm={searchTerm}
            itemsPerPage={5}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              opacity: 0.9,
              transform: "rotate(5deg) scale(1.05)",
              transition: "transform 0.2s",
            }}
            className="card shadow-lg"
          >
            <div className="card-body">
              <h6 className="card-title">{activeTask.title}</h6>
              <p className="card-text text-muted small">
                {activeTask.description}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
