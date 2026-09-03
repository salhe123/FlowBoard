import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BoardService } from '../board.service';
import { Project } from '../models';

@Component({
  selector: 'app-projects',
  imports: [FormsModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  private readonly board = inject(BoardService);

  projects: Project[] = [];
  name = '';
  description = '';
  query = '';
  editingId = '';
  editName = '';
  editDescription = '';

  constructor() {
    this.reload();
  }

  add() {
    this.board.addProject(this.name, this.description);
    this.name = '';
    this.description = '';
    this.reload();
  }

  startEdit(project: Project) {
    this.editingId = project.id;
    this.editName = project.name;
    this.editDescription = project.description;
  }

  saveEdit() {
    this.board.updateProject(this.editingId, this.editName, this.editDescription);
    this.editingId = '';
    this.reload();
  }

  cancelEdit() {
    this.editingId = '';
  }

  remove(project: Project) {
    if (!confirm(`Delete “${project.name}” and its tasks?`)) {
      return;
    }
    this.board.deleteProject(project.id);
    this.reload();
  }

  star(project: Project) {
    this.board.toggleStar(project.id);
    this.reload();
  }

  visible(): Project[] {
    const q = this.query.trim().toLowerCase();
    return this.projects
      .filter(
        (project) =>
          !q ||
          project.name.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q),
      )
      .sort((a, b) => Number(b.starred) - Number(a.starred));
  }

  counts(projectId: string) {
    return this.board.countsFor(projectId);
  }

  private reload() {
    this.projects = this.board.allProjects();
  }
}
