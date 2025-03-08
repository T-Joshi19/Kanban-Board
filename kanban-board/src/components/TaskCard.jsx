import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../store/kanbanSlice";
import "./TaskCard.css";

const TaskCard = ({ task, column }) => {
  const dispatch = useDispatch();

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={() => dispatch(deleteTask({ taskId: task.id, column }))}>
        ❌ Delete
      </button>
    </div>
  );
};

export default TaskCard;
