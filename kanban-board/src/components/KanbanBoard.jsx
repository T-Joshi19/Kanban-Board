import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./KanbanBoard.css";

// Drag-and-Drop Item Type
const ItemType = "TASK";

// Task Component
const TaskCard = ({ task, moveTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="task-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
};

// Column Component
const KanbanColumn = ({ title, tasks, moveTask }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => moveTask(item.id, title),
  });

  return (
    <div ref={drop} className="kanban-column">
      <h2>{title}</h2>
      <div className="tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} moveTask={moveTask} />
        ))}
      </div>
    </div>
  );
};

// Main Kanban Board Component
const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", description: "Complete UI Design", status: "To Do" },
    { id: 2, title: "Task 2", description: "Implement Drag & Drop", status: "In Progress" },
    { id: 3, title: "Task 3", description: "Write Unit Tests", status: "Peer Review" },
    { id: 4, title: "Task 4", description: "Deploy to Production", status: "Done" },
  ]);

  const moveTask = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const columns = ["To Do", "In Progress", "Peer Review", "Done"];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        <h1>Kanban Board</h1>
        <div className="kanban-columns">
          {columns.map((column) => (
            <KanbanColumn
              key={column}
              title={column}
              tasks={tasks.filter((task) => task.status === column)}
              moveTask={moveTask}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
