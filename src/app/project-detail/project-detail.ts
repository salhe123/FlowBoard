import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BoardService } from '../board.service';
import {
  PEOPLE,
  Project,
  Task,
  TASK_PRIORITIES,
  TASK_STEPS,
  TaskPriority,
  TaskStatus,
} from '../models';

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
  newPriority: TaskPriority = 'medium';
  newAssignee = '';
  priorityFilter: TaskPriority | 'all' = 'all';
  assigneeFilter = 'all';
  onlyOverdue = false;
  sortBy: 'board' | 'priority' | 'due' = 'board';
  steps = TASK_STEPS;
  priorities = TASK_PRIORITIES;
  people = PEOPLE;
  draggingId = '';
  overStatus: TaskStatus | '' = '';
  editingId = '';
  editTitle = '';
  editPriority: TaskPriority = 'medium';
  editNotes = '';
  editDue = '';
  editAssignee = '';
  hideDone = false;
  checkDraft: Record<string, string> = {};
  projects: Project[] = [];
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
    this.board.addTask(this.project.id, this.title, this.newPriority, this.newAssignee);
    this.title = '';
    this.newPriority = 'medium';
    this.newAssignee = '';
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
    this.editPriority = task.priority;
    this.editNotes = task.notes;
    this.editDue = task.due;
    this.editAssignee = task.assignee;
  }

  saveEdit() {
    this.board.updateTask(this.editingId, {
      title: this.editTitle,
      priority: this.editPriority,
      notes: this.editNotes,
      due: this.editDue,
      assignee: this.editAssignee,
    });
    this.editingId = '';
    this.reload();
  }

  cancelEdit() {
    this.editingId = '';
  }

  cycle(taskId: string) {
    this.board.cycleStatus(taskId);
    this.reload();
  }

  remove(taskId: string) {
    if (!confirm('Delete this task?')) {
      return;
    }
    this.board.deleteTask(taskId);
    this.reload();
  }

  copy(taskId: string) {
    this.board.duplicateTask(taskId);
    this.reload();
  }

  move(taskId: string, projectId: string) {
    if (!projectId || projectId === this.project?.id) {
      return;
    }
    this.board.moveTask(taskId, projectId);
    this.reload();
  }

  toggleItem(taskId: string, itemId: string) {
    this.board.toggleCheck(taskId, itemId);
    this.reload();
  }

  addItem(taskId: string) {
    this.board.addCheck(taskId, this.checkDraft[taskId] ?? '');
    this.checkDraft[taskId] = '';
    this.reload();
  }

  removeItem(taskId: string, itemId: string) {
    this.board.removeCheck(taskId, itemId);
    this.reload();
  }

  star() {
    if (!this.project) {
      return;
    }
    this.board.toggleStar(this.project.id);
    this.reload();
  }

  doneCount(task: Task): number {
    return (task.checklist ?? []).filter((item) => item.done).length;
  }

  otherProjects() {
    return this.projects.filter((item) => item.id !== this.project?.id);
  }

  visibleSteps() {
    return this.hideDone ? this.steps.filter((step) => step.id !== 'done') : this.steps;
  }

  overdue(task: Task): boolean {
    return this.board.isOverdue(task);
  }

  tasksIn(status: TaskStatus): Task[] {
    const q = this.query.trim().toLowerCase();
    const rank = { high: 0, medium: 1, low: 2 };
    let list = this.tasks.filter((task) => {
      const matchesQuery =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.notes.toLowerCase().includes(q) ||
        task.assignee.toLowerCase().includes(q);
      const matchesPriority = this.priorityFilter === 'all' || task.priority === this.priorityFilter;
      const matchesAssignee =
        this.assigneeFilter === 'all' ||
        (this.assigneeFilter === 'none' && !task.assignee) ||
        task.assignee === this.assigneeFilter;
      const matchesOverdue = !this.onlyOverdue || this.overdue(task);
      return task.status === status && matchesQuery && matchesPriority && matchesAssignee && matchesOverdue;
    });

    if (this.sortBy === 'priority') {
      list = [...list].sort((a, b) => rank[a.priority] - rank[b.priority]);
    }
    if (this.sortBy === 'due') {
      list = [...list].sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
    }
    return list;
  }

  dragStart(event: DragEvent, taskId: string) {
    if (this.editingId === taskId || (event.target as HTMLElement).closest('.nodrag')) {
      event.preventDefault();
      return;
    }
    this.draggingId = taskId;
  }

  moveFromSelect(taskId: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.move(taskId, select.value);
    select.value = '';
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
    this.projects = this.board.allProjects();
    if (this.project) {
      this.project = this.board.projectById(this.project.id);
    }
    this.tasks = this.project ? this.board.tasksFor(this.project.id) : [];
  }
}
