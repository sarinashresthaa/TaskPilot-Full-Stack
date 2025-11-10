const priorityWeight = {
  high: 1,
  medium: 2,
  low: 3,
};

export const getOptimizedTask = (tasks) => {
  return tasks
    ?.filter((task) => task.status !== "done")
    .sort((a, b) => {
      const priorityDiff =
        priorityWeight[a.priority.toLowerCase()] -
        priorityWeight[b.priority.toLowerCase()];
      if (priorityDiff !== 0) return priorityDiff;

      const deadlineA = new Date(a.deadline);
      const deadlineB = new Date(b.deadline);
      if (deadlineA.getTime() !== deadlineB.getTime()) {
        return deadlineA - deadlineB;
      }

      return a.estimatedEffort - b.estimatedEffort;
    })
    .slice(0, 5);
};