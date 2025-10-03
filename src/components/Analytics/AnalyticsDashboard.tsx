import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, CartesianGrid, Bar
} from "recharts";
import "./AnalyticsDashboard.css";
import { userAxios } from "../../Constraints/axiosInterceptor";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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
  }, []);

  // Prepare chart data
  const statusData = Object.entries(
    tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const priorityData = Object.entries(
    tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const commentData = tasks
    .map(task => ({ title: task.title, comments: task.comments.length }))
    .sort((a, b) => b.comments - a.comments)
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Task Analytics Dashboard</h1>

      <div className="chart-grid">
        {/* Tasks by Status */}
        <div className="chart-card">
          <h2 className="chart-card-title">Tasks by Status</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Tasks by Priority */}
        <div className="chart-card">
          <h2 className="chart-card-title">Tasks by Priority</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={priorityData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {priorityData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Top Tasks by Comments */}
        <div className="chart-card" style={{ gridColumn: "span 2" }}>
          <h2 className="chart-card-title">Top 5 Tasks by Comments</h2>
          <BarChart
            width={700}
            height={300}
            data={commentData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="comments" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
