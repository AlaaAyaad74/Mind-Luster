import { useMemo, useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskColumnProps, SortableTaskCardProps } from "../models/Task";
import { TaskCard } from "./TaskCard";
import { Pagination } from "./Pagination";

const SortableTaskCard = ({
  task,
  onEdit,
  onDelete,
}: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        style={{ cursor: "grab" }}
        onMouseDown={(e) => {
          // Don't trigger drag if clicking on buttons
          if (
            (e.target as HTMLElement).closest("button") ||
            (e.target as HTMLElement).tagName === "BUTTON"
          ) {
            e.stopPropagation();
          }
        }}
      >
        <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

export const TaskColumn = ({
  title,
  columnId,
  tasks,
  onEdit,
  onDelete,
  searchTerm,
  itemsPerPage = 5,
}: TaskColumnProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Make column droppable
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: columnId,
  });

  // Filter tasks by search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    const lowerSearch = searchTerm.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description.toLowerCase().includes(lowerSearch)
    );
  }, [tasks, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columnStyle = {
    backgroundColor: isOver ? "#f8f8f8" : "#ffffff",
    border: isOver ? "2px dashed #cccccc" : "none",
    borderRadius: "8px",
    minHeight: "400px",
    transition: "background-color 0.2s ease",
  };

  return (
    <div className="col-md-3">
      <div className="card h-100 task-column">
        <div className="card-header">
          <h6 className="mb-0">
            {title} ({filteredTasks.length})
          </h6>
        </div>
        <div
          ref={setDroppableRef}
          className="card-body"
          style={{
            ...columnStyle,
            maxHeight: "600px",
            overflowY: "auto",
            padding: isOver ? "14px" : "16px",
          }}
        >
          <SortableContext
            items={paginatedTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="text-muted text-center py-4">
                {isOver ? "Drop here" : "No tasks found"}
              </div>
            )}
          </SortableContext>
        </div>
        <div className="card-footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
