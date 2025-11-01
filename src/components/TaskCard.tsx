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
    <div className="card mb-2 shadow-sm">
      <div className="card-body p-2 d-flex flex-column">
        <div className="flex-grow-1 mb-2">
          <h6 className="card-title fw-semibold mb-1 small">
            {task.title}
          </h6>
          {task.description && (
            <p className="card-text text-muted small mb-0">
              {task.description}
            </p>
          )}
        </div>
        <div className="d-flex gap-2 justify-content-end border-top pt-2 mt-auto">
          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            onClick={handleEditClick}
            type="button"
            title="Edit task"
          >
            <EditIcon width={16} height={16} />
            <span className="small">Edit</span>
          </button>
          <button
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            onClick={handleDeleteClick}
            type="button"
            title="Delete task"
          >
            <DeleteIcon width={16} height={16} />
            <span className="small">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
