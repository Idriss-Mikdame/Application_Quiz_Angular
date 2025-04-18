import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
})
export class QuizComponent implements OnInit {
  questions: any[] = [];
  currentIndex: number = 0;
  score: number = 0;
  showResult: boolean = false;
  userAnswer: string | null = null;
  shuffledAnswers: string[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const category = Number(params['category']);
      const difficulty = params['difficulty'];

      if (category && difficulty) {
        this.quizService.getQuestions(category, difficulty).subscribe((data: any) => {
          this.questions = data.results;
          this.shuffleCurrentAnswers();
        });
      }
    });
  }

  shuffleCurrentAnswers(): void {
    const currentQuestion = this.questions[this.currentIndex];
    this.shuffledAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]
      .sort(() => Math.random() - 0.5);
  }

  selectAnswer(answer: string): void {
    this.userAnswer = answer;
    const correct = this.questions[this.currentIndex].correct_answer;

    if (answer === correct) {
      this.score++;
    }

    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
  }

  nextQuestion(): void {
    this.userAnswer = null;
    this.currentIndex++;

    if (this.currentIndex < this.questions.length) {
      this.shuffleCurrentAnswers();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz(): void {
    this.showResult = true;

    // Stocker score et total dans le localStorage
    localStorage.setItem('quiz_score', this.score.toString());
    localStorage.setItem('quiz_total', this.questions.length.toString());

    // Rediriger vers la page des résultats
    this.router.navigate(['/result']);
  }
}
