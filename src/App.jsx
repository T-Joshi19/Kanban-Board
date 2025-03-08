import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

const initialTasks = {
  "to-do": [
    { id: "1", title: "Complete UI Design", description: "Task 1" },
    { id: "2", title: "Assignment 1", description: "Complete the project" },
  ],
  "in-progress": [
    { id: "3", title: "Implement Drag & Drop", description: "Task 2" },
  ],
  "peer-review": [{ id: "4", title: "Write Unit Tests", description: "Task 3" }],
  "done": [{ id: "5", title: "Deploy to Production", description: "Task 4" }],
};

const columns = [
  { id: "to-do", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "peer-review", title: "Peer Review" },
  { id: "done", title: "Done" },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "to-do" });
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  
  //Handle Drag End
  const onDragEnd = (result) => {
    console.log("Drag Result:", result);
    if (!result.destination) return; // Task dropped outside any column

    const { source, destination } = result;
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    //Copy tasks
    const updatedTasks = { ...tasks };
    const [movedTask] = updatedTasks[sourceCol].splice(source.index, 1);
    updatedTasks[destCol].splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
  };

  // 🔥 Handle Task Addition
  const addTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;
    const newTaskObj = { id: Date.now().toString(), title: newTask.title, description: newTask.description };
    setTasks({ ...tasks, [newTask.status]: [...tasks[newTask.status], newTaskObj] });
    setNewTask({ title: "", description: "", status: "to-do" });
  };

  // 🔥 Handle Task Deletion
  const deleteTask = (col, taskId) => {
    setTasks({ ...tasks, [col]: tasks[col].filter((task) => task.id !== taskId) });
  };
  // useEffect(() => {
  //   localStorage.setItem("tasks", JSON.stringify(tasks));
  // }, [tasks]);
  
  // useEffect(() => {
  //   const savedTasks = localStorage.getItem("tasks");
  //   if (savedTasks) setTasks(JSON.parse(savedTasks));
  // }, []);
  
  return (
    <div className="app-container">
      <h1>Kanban Board</h1>

      {/* 🔥 Task Input Form */}
      <div className="task-input">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>{col.title}</option>
          ))}
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* 🔥 Drag-and-Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                  <h2>{col.title}</h2>
                  {tasks[col.id].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-card ${snapshot.isDragging ? "dragging" : ""}`}
                        >
                          <strong>{task.title}</strong>
                          <p>{task.description}</p>
                          <button className="delete-btn" onClick={() => deleteTask(col.id, task.id)}>🗑</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder} {/* ✅ Fix for disappearing tasks */}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
