import { useState, useEffect } from "react";

import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await fetchTasks();

      setTasks(taskFromServer);
    };

    getTasks();
  }, []);

  // call the server for all the data

  const fetchTasks = async () => {
    const reponse = await fetch("http://localhost:5000/tasks");
    const data = await reponse.json();

    return data;
  };

  //  call the server for one task

  const fetchTask = async (id) => {
    const reponse = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await reponse.json();

    return data;
  };

  //  Add Task

  const addTask = async (task) => {
    // const id = Math.floor(Math.random() * 1000) + 1;

    // const newTask = { id, ...task };

    const response = await fetch(`http://localhost:5000/tasks`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();

    setTasks([...tasks, data]);
  };

  // Delete  Task function
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  //  Toggle Reminder

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);

    const updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updateTask),
    });

    const data = await response.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <div className="container">
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "Nothing Todo"
      )}
    </div>
  );
}

export default App;
