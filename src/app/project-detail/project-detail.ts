import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BoardService } from '../board.service';
import { Project, Task, TASK_STEPS, TaskStatus } from '../models';

@Component({
  selector: 'app-project-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly board = inject(BoardService);

  project: Project | undefined;
  tasks: Task[] = [];
  title = '';
  query = '';
  steps = TASK_STEPS;
  draggingId = '';
  overStatus: TaskStatus | '' = '';
  editingId = '';
  editTitle = '';
  editingProject = false;
  projectName = '';
  projectDescription = '';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.project = this.board.projectById(id);
    this.reload();
  }

  add() {
    if (!this.project) {
      return;
    }
    this.board.addTask(this.project.id, this.title);
    this.title = '';
    this.reload();
  }

  startEditProject() {
    if (!this.project) {
      return;
    }
    this.editingProject = true;
    this.projectName = this.project.name;
    this.projectDescription = this.project.description;
  }

  saveProject() {
    if (!this.project) {
      return;
    }
    this.board.updateProject(this.project.id, this.projectName, this.projectDescription);
    this.editingProject = false;
    this.project = this.board.projectById(this.project.id);
  }

  cancelProject() {
    this.editingProject = false;
  }

  startEdit(task: Task) {
    this.editingId = task.id;
    this.editTitle = task.title;
  }

  saveEdit() {
    this.board.renameTask(this.editingId, this.editTitle);
    this.editingId = '';
    this.editTitle = '';
    this.reload();
  }

  cancelEdit() {
    this.editingId = '';
    this.editTitle = '';
  }

  cycle(taskId: string) {
    this.board.cycleStatus(taskId);
    this.reload();
  }

  remove(taskId: string) {
    this.board.deleteTask(taskId);
    this.reload();
  }

  tasksIn(status: TaskStatus): Task[] {
    const q = this.query.trim().toLowerCase();
    return this.tasks.filter(
      (task) => task.status === status && (!q || task.title.toLowerCase().includes(q)),
    );
  }

  dragStart(taskId: string) {
    if (this.editingId === taskId) {
      return;
    }
    this.draggingId = taskId;
  }

  dragOver(event: DragEvent, status: TaskStatus) {
    event.preventDefault();
    this.overStatus = status;
  }

  dragLeave() {
    this.overStatus = '';
  }

  drop(status: TaskStatus) {
    if (this.draggingId) {
      this.board.setStatus(this.draggingId, status);
      this.draggingId = '';
      this.overStatus = '';
      this.reload();
    }
  }

  private reload() {
    if (!this.project) {
      this.tasks = [];
      return;
    }
    this.tasks = this.board.tasksFor(this.project.id);
  }
}
