import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  category: number = 9;
  difficulty: string = 'easy';

  constructor(private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    this.quizService.getCategories().subscribe(data => {
      this.categories = data.trivia_categories;
    });
  }

  startQuiz(): void {
    localStorage.setItem('quiz-settings', JSON.stringify({
      category: this.category,
      difficulty: this.difficulty
    }));
    this.router.navigate(['/quiz']);
  }
}
