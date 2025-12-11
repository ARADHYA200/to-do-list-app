// import { useState } from "react";
// import "./app.css";

// export default function App() {
//   const [tasks, setTasks] = useState([]);
//   const [text, setText] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   const addTask = (e) => {
//     e.preventDefault();
//     if (!text.trim() || !date || !time) return;

//     const datetime = `${date}T${time}`;
//     const newTask = {
//       id: Date.now(),
//       text,
//       datetime,
//       completed: false,
//     };

//     setTasks([...tasks, newTask]);
//     setText("");
//     setDate("");
//     setTime("");
//   };

//   const toggleComplete = (id) => {
//     setTasks(
//       tasks.map((t) =>
//         t.id === id ? { ...t, completed: !t.completed } : t
//       )
//     );
//   };

//   const editTask = (id) => {
//     const newText = prompt("Edit your task:");
//     if (newText) {
//       setTasks(
//         tasks.map((t) =>
//           t.id === id ? { ...t, text: newText } : t
//         )
//       );
//     }
//   };

//   const deleteTask = (id) => {
//     setTasks(tasks.filter((t) => t.id !== id));
//   };

//   return (
//     <div className="container">
//       <h1>📝 To-Do List Web App</h1>

//       {/* FORM */}
//       <form onSubmit={addTask}>
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Enter a new task..."
//           required
//         />
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           required
//         />
//         <input
//           type="time"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           required
//         />
//         <button type="submit">Add Task</button>
//       </form>

//       {/* TASK LIST */}
//       <ul id="task-list">
//         {tasks.map((task) => {
//           const dueDate = new Date(task.datetime);
//           const dateStr = dueDate.toLocaleDateString();
//           const timeStr = dueDate.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           });

//           return (
//             <li
//               key={task.id}
//               className={`task-item ${task.completed ? "completed" : ""}`}
//             >
//               <div className="task-content">{task.text}</div>

//               <div className="task-meta">
//                 <div className="task-date">
//                   📅 <strong>Date:</strong> {dateStr}
//                 </div>
//                 <div className="task-time">
//                   ⏰ <strong>Time:</strong> {timeStr}
//                 </div>
//               </div>

//               <div className="task-actions">
//                 <button onClick={() => toggleComplete(task.id)}>✔ Done</button>
//                 <button onClick={() => editTask(task.id)}>✏ Edit</button>
//                 <button onClick={() => deleteTask(task.id)}>🗑 Delete</button>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import "./app.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const API_URL = "http://127.0.0.1:5000/tasks";

  // 🧠 Load tasks from backend when app starts
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // ➕ Add a new task
  const addTask = (e) => {
    e.preventDefault();
    if (!text.trim() || !date || !time) return;

    const datetime = `${date}T${time}`;
    const newTask = {
      id: Date.now(),
      text,
      datetime,
      completed: false,
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then(() => setTasks([...tasks, newTask]))
      .catch((err) => console.error("Error adding task:", err));

    setText("");
    setDate("");
    setTime("");
  };

  // ❌ Delete a task
  const deleteTask = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch((err) => console.error("Error deleting task:", err));
  };

  // ✅ Toggle completion (just on UI for now)
  const toggleComplete = (id) => {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="container">
      <h1>📝 To-Do List Web App (with Python Backup)</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a new task..."
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <ul id="task-list">
        {tasks.map((task) => {
          const dueDate = new Date(task.datetime);
          const dateStr = dueDate.toLocaleDateString();
          const timeStr = dueDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-content">{task.text}</div>
              <div className="task-meta">
                📅 {dateStr} ⏰ {timeStr}
              </div>
              <div className="task-actions">
                <button onClick={() => toggleComplete(task.id)}>✔</button>
                <button onClick={() => deleteTask(task.id)}>🗑</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
