import { Injectable } from '@angular/core';
import { Project, Task } from './models';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly projects: Project[] = [
    { id: 'p1', name: 'Website', description: 'Marketing site refresh' },
    { id: 'p2', name: 'Mobile app', description: 'iOS / Android client' },
    { id: 'p3', name: 'API', description: 'Public REST API' },
  ];

  private readonly tasks: Task[] = [
    { id: 't1', projectId: 'p1', title: 'Home page layout', status: 'done' },
    { id: 't2', projectId: 'p1', title: 'Contact form', status: 'doing' },
    { id: 't3', projectId: 'p1', title: 'SEO meta tags', status: 'todo' },
    { id: 't4', projectId: 'p2', title: 'Login screen', status: 'doing' },
    { id: 't5', projectId: 'p2', title: 'Push notifications', status: 'todo' },
    { id: 't6', projectId: 'p3', title: 'Auth endpoints', status: 'done' },
    { id: 't7', projectId: 'p3', title: 'Rate limiting', status: 'todo' },
  ];

  userName(): string {
    return sessionStorage.getItem('flowboard-user') ?? '';
  }

  allProjects(): Project[] {
    return this.projects;
  }

  allTasks(): Task[] {
    return this.tasks;
  }

  tasksFor(projectId: string): Task[] {
    return this.tasks.filter((task) => task.projectId === projectId);
  }

  counts() {
    const tasks = this.tasks;
    return {
      projects: this.projects.length,
      tasks: tasks.length,
      done: tasks.filter((task) => task.status === 'done').length,
    };
  }
}
