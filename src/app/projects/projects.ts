import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  private readonly board = inject(BoardService);

  projects = this.board.allProjects();
}
