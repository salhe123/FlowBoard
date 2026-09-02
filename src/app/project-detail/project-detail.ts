import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BoardService } from '../board.service';
import { Project, Task } from '../models';

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

  cycle(taskId: string) {
    this.board.cycleStatus(taskId);
    this.reload();
  }

  remove(taskId: string) {
    this.board.deleteTask(taskId);
    this.reload();
  }

  private reload() {
    if (!this.project) {
      this.tasks = [];
      return;
    }
    this.tasks = this.board.tasksFor(this.project.id);
  }
}
