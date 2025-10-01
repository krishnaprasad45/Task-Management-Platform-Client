import React, { useState, FormEvent, useEffect } from "react";
import { userAxios } from "../../../Constraints/axiosInterceptor";
import styles from "../../../styles/custom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useLocation } from "react-router-dom";

// Define User and Comment types
interface User {
  _id: string;
  firstname: string;
  email: string;
}

interface Comment {
  _id: unknown;
  id: number;
  text: string;
  user: string;
}

// Task type
interface Task {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string;
  assigned_to: string;
  assigned_by: string;
  comments: Comment[];
}

const TaskManager: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  console.log("user???", user);
  const [users, setUsers] = useState<User[]>([]);

  console.log("userslist>>", users);
  const location = useLocation();
  const taskToEdit = location.state?.taskToEdit;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userAxios.get("list-users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const [task, setTask] = useState<Task>({
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
    status: taskToEdit?.status || "pending",
    priority: taskToEdit?.priority || "medium",
    due_date: taskToEdit?.due_date || "",
    assigned_to: taskToEdit?.assigned_to || "",
    assigned_by: taskToEdit?.assigned_by || user?.userId || "",
    comments: taskToEdit?.comments || [],
  });

  const [newComment, setNewComment] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Handle task input changes
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add or update comment
  // Add or update comment
  const handleComment = () => {
    if (!newComment.trim()) return;

    if (editIndex !== null) {
      // Update existing comment
      const updatedComments = task.comments.map((c, i) => (i === editIndex ? { ...c, text: newComment } : c));
      setTask({ ...task, comments: updatedComments });
      setEditIndex(null);
    } else {
      // Add new comment
      const newC: Comment = {
        id: Date.now(),
        text: newComment,
        user: user?.username ?? "Anonymous",
        _id: undefined
      };
      setTask({ ...task, comments: [...task.comments, newC] });
    }

    setNewComment("");
  };

  const editComment = (index: number) => {
    setNewComment(task.comments[index].text);
    setEditIndex(index);
  };

  const deleteComment = async (index: number) => {
  const commentToDelete = task.comments[index];
   console.log("commentToDelete>>>",commentToDelete)
  if (!commentToDelete?._id) {
    alert("Comment ID not found");
    return;
  }

  // Optional: Confirm before deleting
  if (!window.confirm("Do you really want to delete this comment?")) return;

  try {
    // Call API
    await userAxios.delete(`/delete-comment/${commentToDelete._id}`);

    // Update local state
    const updatedComments = task.comments.filter((_, i) => i !== index);
    setTask({ ...task, comments: updatedComments });
  } catch (err) {
    console.error("Error deleting comment:", err);
    alert("Failed to delete comment");
  }
};


  // Submit task
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (taskToEdit) {
        // Update existing task
        await userAxios.patch(`/update-task/${taskToEdit._id}`, task);
        alert("Task updated successfully!");
      } else {
        // Create new task

        const response = await userAxios.post("/create-task", task);
        console.log("Task created:", response.data);
        alert("Task created successfully!");
        // Reset task form
        setTask({
          title: "",
          description: "",
          status: "pending",
          priority: "medium",
          due_date: "",
          assigned_to: "",
          assigned_by: user?.username ?? "",
          comments: [],
        });
      }
    } catch (error: any) {
      console.error("Error creating task:", error.response?.data || error.message);
      alert("Failed to create task. Check console for details.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{taskToEdit ? "Update Task" : "Create Task"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="title" value={task.title} onChange={handleChange} placeholder="Title *" required style={styles.input} />

        <textarea name="description" value={task.description} onChange={handleChange} placeholder="Description *" required style={{ ...styles.input, height: "100px" }} />

        <div style={styles.row}>
          <select name="status" value={task.status} onChange={handleChange} style={styles.input}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>

          <select name="priority" value={task.priority} onChange={handleChange} style={styles.input}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div style={styles.row}>
          <input type="date" name="due_date" value={task.due_date} onChange={handleChange} style={styles.input} />
          <select name="assigned_to" value={task.assigned_to} onChange={handleChange} required style={styles.input}>
            <option value="">Assign To *</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstname}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.commentSection}>
          <h3 style={{ marginBottom: "10px" }}>Comments</h3>
          <div style={styles.commentInput}>
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add comment" style={{ ...styles.input, flex: 1 }} />
            <button type="button" onClick={handleComment} style={styles.commentButton}>
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>

          <ul style={styles.commentList}>
            {task.comments.map((c, index) => (
              <li key={c.id} style={styles.commentItem}>
                <strong>{c.user}:</strong> {c.text}
                <div>
                  <button onClick={() => editComment(index)} style={styles.commentAction}>
                    Edit
                  </button>
                  <button onClick={() => deleteComment(index)} style={styles.commentAction}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" style={{ ...styles.submitButton }}>
          {taskToEdit ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskManager;
