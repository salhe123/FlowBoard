import { Injectable, signal } from '@angular/core';
import { Project, Task, TASK_STEPS, TaskStatus } from './models';

const USER_KEY = 'flowboard-user';
const DATA_KEY = 'flowboard-data';

const SEED_PROJECTS: Project[] = [
  { id: 'p1', name: 'Website', description: 'Marketing site refresh' },
  { id: 'p2', name: 'Mobile app', description: 'iOS / Android client' },
  { id: 'p3', name: 'API', description: 'Public REST API' },
];

const SEED_TASKS: Task[] = [
  { id: 't1', projectId: 'p1', title: 'Home page layout', status: 'done' },
  { id: 't2', projectId: 'p1', title: 'Contact form', status: 'in-progress' },
  { id: 't3', projectId: 'p1', title: 'SEO meta tags', status: 'todo' },
  { id: 't4', projectId: 'p2', title: 'Login screen', status: 'in-progress' },
  { id: 't5', projectId: 'p2', title: 'Push notifications', status: 'open' },
  { id: 't6', projectId: 'p3', title: 'Auth endpoints', status: 'review' },
  { id: 't7', projectId: 'p3', title: 'Rate limiting', status: 'todo' },
];

@Injectable({ providedIn: 'root' })
export class BoardService {
  readonly userName = signal(sessionStorage.getItem(USER_KEY) ?? '');
  private projects: Project[] = [];
  private tasks: Task[] = [];

  constructor() {
    const saved = this.read();
    this.projects = saved.projects;
    this.tasks = saved.tasks;
  }

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

  addProject(name: string, description: string) {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    this.projects.push({
      id: `p${Date.now()}`,
      name: trimmed,
      description: description.trim(),
    });
    this.save();
  }

  updateProject(projectId: string, name: string, description: string) {
    const trimmed = name.trim();
    const project = this.projects.find((item) => item.id === projectId);
    if (project && trimmed) {
      project.name = trimmed;
      project.description = description.trim();
      this.save();
    }
  }

  deleteProject(projectId: string) {
    this.projects = this.projects.filter((project) => project.id !== projectId);
    this.tasks = this.tasks.filter((task) => task.projectId !== projectId);
    this.save();
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
    this.save();
  }

  renameTask(taskId: string, title: string) {
    const trimmed = title.trim();
    const task = this.tasks.find((item) => item.id === taskId);
    if (task && trimmed) {
      task.title = trimmed;
      this.save();
    }
  }

  setStatus(taskId: string, status: TaskStatus) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (task) {
      task.status = status;
      this.save();
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
    this.save();
  }

  deleteTask(taskId: string) {
    const index = this.tasks.findIndex((item) => item.id === taskId);
    if (index >= 0) {
      this.tasks.splice(index, 1);
      this.save();
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

  countsFor(projectId: string) {
    const tasks = this.tasksFor(projectId);
    return {
      total: tasks.length,
      done: tasks.filter((task) => task.status === 'done').length,
      steps: TASK_STEPS.map((step) => ({
        ...step,
        count: tasks.filter((task) => task.status === step.id).length,
      })),
    };
  }

  resetDemo() {
    const seeded = this.seed();
    this.projects = seeded.projects;
    this.tasks = seeded.tasks;
    this.save();
  }

  private read(): { projects: Project[]; tasks: Task[] } {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (!raw) {
        return this.seed();
      }

      const parsed = JSON.parse(raw) as { projects?: Project[]; tasks?: Task[] };
      if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.tasks)) {
        return this.seed();
      }

      return { projects: parsed.projects, tasks: parsed.tasks };
    } catch {
      return this.seed();
    }
  }

  private save() {
    localStorage.setItem(
      DATA_KEY,
      JSON.stringify({ projects: this.projects, tasks: this.tasks }),
    );
  }

  private seed(): { projects: Project[]; tasks: Task[] } {
    return {
      projects: SEED_PROJECTS.map((project) => ({ ...project })),
      tasks: SEED_TASKS.map((task) => ({ ...task })),
    };
  }
}
