import React, { useState } from 'react';

interface Task {
  id: number;
  name: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  estimatedTime: string;
  comments: Comment[];
  attachments: File[];
}

interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: Date;
}

const teamMembers = ['Alice', 'Bob', 'Charlie', 'David'];

const UserTaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState<'To Do' | 'In Progress' | 'Completed'>('To Do');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [commentText, setCommentText] = useState('');
  const [author, setAuthor] = useState(teamMembers[0]);

  const addTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      name: taskName,
      status: taskStatus,
      estimatedTime,
      comments: [],
      attachments: []
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setTaskStatus('To Do');
    setEstimatedTime('');
  };

  const updateTaskStatus = (taskId: number, status: 'To Do' | 'In Progress' | 'Completed') => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status } : task));
  };

  const addComment = (taskId: number) => {
    const newComment: Comment = {
      id: Date.now(),
      text: commentText,
      author,
      timestamp: new Date()
    };
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, comments: [...task.comments, newComment] } : task
    ));
    setCommentText('');
  };

  const attachFile = (taskId: number, files: FileList) => {
    const fileArray = Array.from(files);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, attachments: [...task.attachments, ...fileArray] } : task
    ));
  };

  return (
    <div className="container mx-auto mt-4 p-4" style={{ backgroundColor: '#f4f4f9', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
      <h1 className="text-2xl font-bold mb-4">Task Tracking and Updates</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border p-2 mr-2"
        />
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value as 'To Do' | 'In Progress' | 'Completed')}
          className="border p-2 mr-2"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="text"
          placeholder="Estimated Time"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={addTask} className="bg-blue-500 text-white p-2">Add Task</button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Tasks</h2>
        {tasks.map(task => (
          <div key={task.id} className="border p-2 mb-2" style={{ backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Task:</strong> {task.name}</p>
                <p><strong>Status:</strong>
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as 'To Do' | 'In Progress' | 'Completed')}
                    className="ml-2 border p-1"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </p>
                <p><strong>Estimated Time:</strong> {task.estimatedTime}</p>
                <p><strong>Comments:</strong></p>
                <ul>
                  {task.comments.map(comment => (
                    <li key={comment.id}>
                      <p>{comment.text} - <em>{comment.author}</em> at {comment.timestamp.toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
                <p><strong>Attachments:</strong></p>
                <ul>
                  {task.attachments.map((file, index) => (
                    <li key={index}>
                      <a href={URL.createObjectURL(file)} download>{file.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <textarea
                  placeholder="Add a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="border p-2 mb-2 w-full"
                />
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="border p-2 mb-2 w-full"
                >
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
                <button onClick={() => addComment(task.id)} className="bg-green-500 text-white p-2 mb-2 w-full">Add Comment</button>
                <input
                  type="file"
                  onChange={(e) => e.target.files && attachFile(task.id, e.target.files)}
                  className="border p-2 w-full"
                  multiple
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTaskManager;
