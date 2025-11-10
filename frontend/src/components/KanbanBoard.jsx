"use client";
import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskDetail from "./Modal/TaskDetails";
import { useEffect } from "react";

const ItemTypes = {
  TASK: "task",
};

// Single task card
const TaskCard = ({ task, index, columnKey, moveTask }) => {
  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { task, fromColumn: columnKey },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (draggedItem) => {
      if (
        draggedItem.task._id !== task._id &&
        draggedItem.fromColumn === columnKey
      ) {
        moveTask(draggedItem.task._id, columnKey, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="mb-3 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer">
      <div className="font-semibold text-indigo-600 text-sm">
        {task.project.title}
      </div>

      <div className="font-medium text-gray-900">{task.title}</div>
      {task.description && (
        <div className="text-sm text-gray-600 mt-1">
          {task.description.substring(0, 70)}
          {task.description.length > 70 && "..."}
        </div>
      )}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>
          {task.priority && (
            <span
              className={`px-2 py-0.5 rounded-full ${
                task.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
              {task.priority}
            </span>
          )}
        </span>
        {task.deadline && (
          <span>{new Date(task.deadline).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
};

// Column component
const Column = ({ columnKey, tasks, moveTask, onDropTask }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (draggedItem) => {
      if (draggedItem.fromColumn !== columnKey) {
        onDropTask(draggedItem.task._id, draggedItem.fromColumn, columnKey);
        draggedItem.fromColumn = columnKey;
      }
    },
  });

  const columnTitles = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  const getColumnColor = {
    todo: "bg-blue-50",
    "in-progress": "bg-yellow-50",
    done: "bg-green-50",
  };

  const [isView, setIsView] = useState(false);
  const [editId, setEditId] = useState(0);

  return (
    <div
      ref={drop}
      className={`rounded-lg p-4 border min-h-[400px] ${getColumnColor[columnKey]} transition-all`}>
      <h2 className="font-semibold text-lg mb-3 text-gray-800 flex items-center justify-between">
        {columnTitles[columnKey]}{" "}
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </h2>
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <div
            key={task._id}
            onClick={() => {
              setIsView(true);
              setEditId(task._id);
            }}>
            <TaskCard
              task={task}
              index={index}
              columnKey={columnKey}
              moveTask={moveTask}
            />
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center py-6">No tasks</p>
      )}

      {isView && <TaskDetail setIsOpen={setIsView} taskId={editId} />}
    </div>
  );
};

// Main Kanban board
const KanbanBoard = ({ tasks = [], onStatusChange }) => {
  const [columns, setColumns] = useState({
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  });

  useEffect(() => {
    setColumns({
      todo: tasks.filter((t) => t.status === "todo"),
      "in-progress": tasks.filter((t) => t.status === "in-progress"),
      done: tasks.filter((t) => t.status === "done"),
    });
  }, [tasks]);

  const moveTask = (taskId, columnKey, newIndex) => {
    const updatedTasks = [...columns[columnKey]];
    const taskIndex = updatedTasks.findIndex((t) => t._id === taskId);
    if (taskIndex === -1) return;
    const [removed] = updatedTasks.splice(taskIndex, 1);
    updatedTasks.splice(newIndex, 0, removed);
    setColumns({ ...columns, [columnKey]: updatedTasks });
  };

  const onDropTask = (taskId, fromColumn, toColumn) => {
    const taskToMove = columns[fromColumn].find((t) => t._id === taskId);
    if (!taskToMove) return;
    setColumns({
      ...columns,
      [fromColumn]: columns[fromColumn].filter((t) => t._id !== taskId),
      [toColumn]: [...columns[toColumn], { ...taskToMove, status: toColumn }],
    });
    if (onStatusChange) onStatusChange(taskId, toColumn);
  };

  console.log(tasks);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {Object.keys(columns).map((key) => (
          <Column
            key={key}
            columnKey={key}
            tasks={columns[key]}
            moveTask={moveTask}
            onDropTask={onDropTask}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
