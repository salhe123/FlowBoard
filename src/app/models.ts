export type TaskStatus = 'open' | 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export const TASK_STEPS: { id: TaskStatus; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export const TASK_PRIORITIES: { id: TaskPriority; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

export const PEOPLE = ['Salhe', 'Maya', 'Alex'];

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
  priority: TaskPriority;
  notes: string;
  due: string;
  assignee: string;
}
