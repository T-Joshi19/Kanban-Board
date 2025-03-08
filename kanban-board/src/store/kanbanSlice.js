import { createSlice } from "@reduxjs/toolkit";

// Initial state with tasks categorized by status
const initialState = {
  tasks: {
    "To Do": [],
    "In Progress": [],
    "Peer Review": [],
    "Done": [],
  },
};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks["To Do"].push(action.payload);
    },
    moveTask: (state, action) => {
      const { taskId, fromColumn, toColumn } = action.payload;
      const taskIndex = state.tasks[fromColumn].findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        const [task] = state.tasks[fromColumn].splice(taskIndex, 1);
        state.tasks[toColumn].push(task);
      }
    },
    deleteTask: (state, action) => {
      const { taskId, column } = action.payload;
      state.tasks[column] = state.tasks[column].filter((task) => task.id !== taskId);
    },
  },
});

export const { addTask, moveTask, deleteTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;
