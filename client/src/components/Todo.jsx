import React, { useState } from 'react';

const Todo = ({ user }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task }]);
      setTask('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Welcome {user.email}</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-2 border"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex justify-between items-center border p-2 rounded">
            <span>{t.text}</span>
            <button
              onClick={() => deleteTask(t.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
