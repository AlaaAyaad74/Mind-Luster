import type { TaskCardProps } from "../models/Task";
import { EditIcon } from "../svgs/EditIcon";
import { DeleteIcon } from "../svgs/DeleteIcon";

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div className="card mb-2 shadow-sm task-card">
      <div className="card-body p-2 d-flex flex-column">
        <div className="flex-grow-1 mb-2">
          <h6
            className="card-title fw-semibold mb-1"
            style={{ fontSize: "0.875rem", lineHeight: "1.2" }}
          >
            {task.title}
          </h6>
          {task.description && (
            <p
              className="card-text text-muted small mb-0"
              style={{
                fontSize: "0.75rem",
                lineHeight: "1.3",
              }}
            >
              {task.description}
            </p>
          )}
        </div>
        <div className="d-flex gap-2 task-card-actions justify-content-end">
          <button
            className="btn btn-action btn-edit"
            onClick={handleEditClick}
            type="button"
            title="Edit task"
          >
            <EditIcon width={16} height={16} className="me-1" />
            <span>Edit</span>
          </button>
          <button
            className="btn btn-action btn-delete"
            onClick={handleDeleteClick}
            type="button"
            title="Delete task"
          >
            <DeleteIcon width={16} height={16} className="me-1" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
