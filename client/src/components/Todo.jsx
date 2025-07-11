import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Todo = ({ user }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/find', { headers });
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!task.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:8080/addtodo',
        { task, markAsDone: false },
        { headers }
      );
      setTasks((prev) => [...prev, response.data.data]);
      setTask('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete('http://localhost:8080/delete', {
        headers,
        data: { taskId: id },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Toggle mark as done/undone
  const toggleMarkAsDone = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        'http://localhost:8080/mark',
        {
          taskId: id,
          markAsDone: !currentStatus,
        },
        { headers }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, markAsDone: response.data.data.markAsDone } : t
        )
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Welcome {user?.userName}
        <button
          onClick={handleLogout}
          className="ml-4 bg-amber-700 text-white text-sm px-3 py-2 rounded-lg"
        >
          Logout
        </button>
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found</p>
        ) : (
          tasks.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span className={t.markAsDone ? 'line-through text-gray-500' : ''}>
                {t.task}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => deleteTask(t._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
                <input
                  type="checkbox"
                  checked={t.markAsDone}
                  onChange={() => toggleMarkAsDone(t._id, t.markAsDone)}
                />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Todo;
