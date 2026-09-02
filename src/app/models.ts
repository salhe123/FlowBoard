export type TaskStatus = 'todo' | 'doing' | 'done';

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
