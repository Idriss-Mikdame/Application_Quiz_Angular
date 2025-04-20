import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService, Category, QuizConfig } from '../../services/quiz.service';
import { StorageService, QuizResult } from '../../services/storage.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  quizForm: FormGroup;
  loading = false;
  error = '';
  recentScores: QuizResult[] = [];

  constructor(
    private quizService: QuizService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.quizForm = this.formBuilder.group({
      category: [0],
      difficulty: ['any'],
      type: ['any'],
      amount: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
      timedMode: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadRecentScores();
  }

  loadCategories(): void {
    this.quizService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
        this.error = 'Impossible de charger les catégories. Veuillez réessayer plus tard.';
      }
    });
  }

  loadRecentScores(): void {
    this.recentScores = this.storageService.getHistory()
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  startQuiz(): void {
    if (this.quizForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const config: QuizConfig = {
      amount: this.quizForm.value.amount,
      category: this.quizForm.value.category !== 0 ? this.quizForm.value.category : undefined,
      difficulty: this.quizForm.value.difficulty !== 'any' ? this.quizForm.value.difficulty : undefined,
      type: this.quizForm.value.type !== 'any' ? this.quizForm.value.type : undefined
    };

    // Stocker le mode chronométré dans le sessionStorage pour l'utiliser dans le composant quiz
    sessionStorage.setItem('timedMode', this.quizForm.value.timedMode ? 'true' : 'false');

    this.quizService.getQuizQuestions(config)
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des questions', error);
          this.error = 'Impossible de charger les questions. Veuillez vérifier vos paramètres et réessayer.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(questions => {
        if (questions.length > 0) {
          this.quizService.startQuiz(questions);
          this.router.navigate(['/quiz']);
        }
      });
  }
}
