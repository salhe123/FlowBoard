export type TaskStatus = 'open' | 'todo' | 'in-progress' | 'review' | 'done';

export const TASK_STEPS: { id: TaskStatus; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
}
