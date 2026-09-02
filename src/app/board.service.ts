import { Injectable, signal } from '@angular/core';
import { Project, Task, TASK_STEPS, TaskStatus } from './models';

const USER_KEY = 'flowboard-user';

@Injectable({ providedIn: 'root' })
export class BoardService {
  readonly userName = signal(sessionStorage.getItem(USER_KEY) ?? '');
  private readonly projects: Project[] = [
    { id: 'p1', name: 'Website', description: 'Marketing site refresh' },
    { id: 'p2', name: 'Mobile app', description: 'iOS / Android client' },
    { id: 'p3', name: 'API', description: 'Public REST API' },
  ];

  private readonly tasks: Task[] = [
    { id: 't1', projectId: 'p1', title: 'Home page layout', status: 'done' },
    { id: 't2', projectId: 'p1', title: 'Contact form', status: 'in-progress' },
    { id: 't3', projectId: 'p1', title: 'SEO meta tags', status: 'todo' },
    { id: 't4', projectId: 'p2', title: 'Login screen', status: 'in-progress' },
    { id: 't5', projectId: 'p2', title: 'Push notifications', status: 'open' },
    { id: 't6', projectId: 'p3', title: 'Auth endpoints', status: 'review' },
    { id: 't7', projectId: 'p3', title: 'Rate limiting', status: 'todo' },
  ];

  login(name: string) {
    sessionStorage.setItem(USER_KEY, name);
    this.userName.set(name);
  }

  logout() {
    sessionStorage.removeItem(USER_KEY);
    this.userName.set('');
  }

  allProjects(): Project[] {
    return this.projects;
  }

  allTasks(): Task[] {
    return this.tasks;
  }

  projectById(id: string): Project | undefined {
    return this.projects.find((project) => project.id === id);
  }

  tasksFor(projectId: string): Task[] {
    return this.tasks.filter((task) => task.projectId === projectId);
  }

  addTask(projectId: string, title: string) {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    this.tasks.push({
      id: `t${Date.now()}`,
      projectId,
      title: trimmed,
      status: 'open',
    });
  }

  renameTask(taskId: string, title: string) {
    const trimmed = title.trim();
    const task = this.tasks.find((item) => item.id === taskId);
    if (task && trimmed) {
      task.title = trimmed;
    }
  }

  setStatus(taskId: string, status: TaskStatus) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (task) {
      task.status = status;
    }
  }

  cycleStatus(taskId: string) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    const order = TASK_STEPS.map((step) => step.id);
    const index = order.indexOf(task.status);
    task.status = order[(index + 1) % order.length];
  }

  deleteTask(taskId: string) {
    const index = this.tasks.findIndex((item) => item.id === taskId);
    if (index >= 0) {
      this.tasks.splice(index, 1);
    }
  }

  counts() {
    const tasks = this.tasks;
    return {
      projects: this.projects.length,
      tasks: tasks.length,
      done: tasks.filter((task) => task.status === 'done').length,
      steps: TASK_STEPS.map((step) => ({
        ...step,
        count: tasks.filter((task) => task.status === step.id).length,
      })),
    };
  }
}
