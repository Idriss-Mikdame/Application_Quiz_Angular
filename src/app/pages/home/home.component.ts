import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  category: number | null = null;
  difficulty: string | null = null;

  constructor(private router: Router) {}

  startQuiz() {
    if (this.category && this.difficulty) {
      this.router.navigate(['/quiz'], {
        queryParams: {
          category: this.category,
          difficulty: this.difficulty
        }
      });
    }
  }
}
