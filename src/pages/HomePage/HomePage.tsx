import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { userAxios } from "../../Constraints/axiosInterceptor";
import ConfirmPopup from "../../styles/Popups/ConfirmPopup";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

interface Comment {
  user: string;
  text: string;
  createdAt: string;
}

interface Task {
  _id: string;
  taskId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  assigned_to: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const UserHome: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [tasks, setTasks] = useState<Task[]>([]);

  console.log("taskzz",tasks)

  // Delete popup states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit popup states
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  // if (!user) return <p>No user logged in.</p>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await userAxios.get("/list-tasks");
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user]);

  // ---------- DELETE TASK ----------

  const openDeleteConfirm = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setSelectedTaskId(null);
    setShowDeleteConfirm(false);
  };

  const confirmDelete = async () => {
    if (!selectedTaskId) return;
    setIsDeleting(true);
    try {
      await userAxios.delete(`/delete-task/${selectedTaskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== selectedTaskId));
      cancelDelete();
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setIsDeleting(false);
    }
  };

   const handleNewTask = () => {
    navigate("/teamlead"); // navigates to TaskManagerPage
  };

  // ---------- EDIT TASK ----------

  const cancelEdit = () => {
    setEditTaskId(null);
    setShowEditConfirm(false);
    setEditTitle("");
    setEditDescription("");
  };

  const handleEdit = (task: Task) => {
    navigate("/teamlead", { state: { taskToEdit: task } });
  };
  const confirmEdit = async () => {
    if (!editTaskId) return;
    setIsUpdating(true);

    try {
      const res = await userAxios.patch(`/update-task/${editTaskId}`, { title: editTitle, description: editDescription });

      setTasks((prev) => prev.map((t) => (t._id === editTaskId ? { ...t, title: res.data.task.title, description: res.data.task.description } : t)));
      cancelEdit();
      alert("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container">
      <div className="headingSection">
        <h2 className="heading">Task List</h2>
        <div className="buttonContainer">
          <button className="customBtn newTaskBtn" onClick={handleNewTask} >
            New Task
          </button>
          <button className="customBtn analyseBtn">
            Analyse
          </button>
        </div>
      </div>

      <table className="taskTable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>{task.assigned_to}</td>
                <td>
                  {task.comments.length > 0 ? (
                    <ul>
                      {task.comments.map((c, i) => (
                        <li key={i}>
                          <strong>{c.user}</strong>: {c.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No comments</span>
                  )}
                </td>
                <td>
                  <button className="btn editBtn" onClick={() => handleEdit(task)}>
                    Edit
                  </button>
                  <button className="btn deleteBtn" onClick={() => openDeleteConfirm(task._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Popup */}
      <ConfirmPopup
        visible={showDeleteConfirm}
        message="Do you really want to delete this task?"
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={isDeleting}
      />

      {/* Edit Confirmation Popup */}
      {showEditConfirm && (
        <div className="confirmOverlay">
          <div className="confirmBox">
            <p>Edit Task</p>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" className="editInput" />
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" className="editInput" />
            <div className="confirmActions">
              <button className="btn cancelBtn" onClick={cancelEdit} disabled={isUpdating}>
                Cancel
              </button>
              <button className="btn confirmBtn" onClick={confirmEdit} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;
