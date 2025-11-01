import { useState, useEffect } from "react";
import type { TaskColumn, TaskFormProps } from "../models/Task";
import { EditIcon } from "../svgs/EditIcon";
import { PlusIcon } from "../svgs/PlusIcon";
import { CheckIcon } from "../svgs/CheckIcon";

export const TaskForm = ({
  task,
  onSave,
  onCancel,
  isSubmitting,
}: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<TaskColumn>("backlog");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setColumn(task.column);
    } else {
      setTitle("");
      setDescription("");
      setColumn("backlog");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title: title.trim(), description: description.trim(), column });
    }
  };

  return (
    <div
      className="modal show d-block modal-overlay"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content task-form-modal">
          <div className="modal-header task-form-header">
            <div className="d-flex align-items-center gap-2">
              {task ? (
                <EditIcon width={20} height={20} />
              ) : (
                <PlusIcon width={20} height={20} />
              )}
              <h5 className="modal-title mb-0">
                {task ? "Edit Task" : "Create New Task"}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-4">
                <label htmlFor="taskTitle" className="form-label fw-semibold">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg task-form-input"
                  id="taskTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter task title"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="taskDescription"
                  className="form-label fw-semibold"
                >
                  Description
                </label>
                <textarea
                  className="form-control task-form-input"
                  id="taskDescription"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter task description (optional)"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="taskColumn" className="form-label fw-semibold">
                  Column
                </label>
                <select
                  className="form-select form-select-lg task-form-input"
                  id="taskColumn"
                  value={column}
                  onChange={(e) => setColumn(e.target.value as TaskColumn)}
                  disabled={isSubmitting}
                >
                  <option value="backlog">📋 Backlog</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="review">👁️ Review</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            </div>
            <div className="modal-footer task-form-footer">
              <button
                type="button"
                className="btn btn-secondary btn-cancel"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-save"
                disabled={isSubmitting || !title.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : task ? (
                  <>
                    <CheckIcon width={16} height={16} className="me-1" />
                    Update Task
                  </>
                ) : (
                  <>
                    <PlusIcon width={16} height={16} className="me-1" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
