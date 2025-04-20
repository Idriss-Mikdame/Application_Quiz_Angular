import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService, QuizQuestion } from '../../services/quiz.service';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-quiz',
  standalone: false,
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  currentQuestion: QuizQuestion | null = null;
  currentIndex = 0;
  totalQuestions = 0;
  selectedAnswer: string | null = null;
  answerSubmitted = false;
  isLastQuestion = false;
  score = 0;
  error = '';
  
  // Mode chronométré
  timedMode = false;
  timeLeft = 30; // Temps par défaut en secondes
  timerSubscription?: Subscription;
  
  // Suivi du temps total
  startTime: number = 0;
  totalTime: number = 0;

  private questionsSubscription?: Subscription;
  private indexSubscription?: Subscription;
  private scoreSubscription?: Subscription;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si des questions sont disponibles
    this.questionsSubscription = this.quizService.currentQuestions$.subscribe(questions => {
      this.totalQuestions = questions.length;
      if (this.totalQuestions === 0) {
        this.error = 'Aucune question disponible. Veuillez retourner à l\'accueil pour démarrer un nouveau quiz.';
      }
    });

    // Observer l'index courant
    this.indexSubscription = this.quizService.currentIndex$.subscribe(index => {
      this.currentIndex = index;
      this.currentQuestion = this.quizService.getCurrentQuestion();
      this.isLastQuestion = this.currentIndex === this.totalQuestions - 1;
      this.resetQuestionState();
    });

    // Observer le score
    this.scoreSubscription = this.quizService.score$.subscribe(score => {
      this.score = score;
    });

    // Vérifier si le mode chronométré est activé
    const timedModeStr = sessionStorage.getItem('timedMode');
    this.timedMode = timedModeStr === 'true';

    // Démarrer le chronomètre global
    this.startTime = Date.now();

    // Démarrer le timer si le mode chronométré est activé
    if (this.timedMode) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    // Se désabonner de tous les observables
    if (this.questionsSubscription) {
      this.questionsSubscription.unsubscribe();
    }
    if (this.indexSubscription) {
      this.indexSubscription.unsubscribe();
    }
    if (this.scoreSubscription) {
      this.scoreSubscription.unsubscribe();
    }
    this.stopTimer();
  }

  selectAnswer(answer: string): void {
    if (!this.answerSubmitted) {
      this.selectedAnswer = answer;
    }
  }

  submitAnswer(): void {
    if (this.selectedAnswer) {
      this.answerSubmitted = true;
      this.stopTimer(); // Arrêter le timer quand la réponse est soumise
      
      // Vérifier la réponse
      this.quizService.answerQuestion(this.selectedAnswer);
    }
  }

  nextQuestion(): void {
    if (this.isLastQuestion) {
      // Calculer le temps total passé
      this.totalTime = Math.floor((Date.now() - this.startTime) / 1000);
      
      // Stocker le temps total et le score dans sessionStorage pour le composant de résultat
      sessionStorage.setItem('quizTime', this.totalTime.toString());
      sessionStorage.setItem('quizScore', this.score.toString());
      sessionStorage.setItem('quizTotal', this.totalQuestions.toString());
      
      // Naviguer vers la page de résultat
      this.router.navigate(['/result']);
    } else {
      // Passer à la question suivante
      this.quizService.nextQuestion();
      
      // Redémarrer le timer si le mode chronométré est activé
      if (this.timedMode) {
        this.startTimer();
      }
    }
  }

  quitQuiz(): void {
    if (confirm('Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera perdue.')) {
      this.router.navigate(['/']);
    }
  }

  private resetQuestionState(): void {
    this.selectedAnswer = null;
    this.answerSubmitted = false;
    this.timeLeft = 30; // Réinitialiser le temps pour chaque question
  }

  private startTimer(): void {
    this.stopTimer(); // S'assurer qu'aucun timer précédent n'est en cours
    this.timeLeft = 30; // Réinitialiser le temps
    
    this.timerSubscription = interval(1000)
      .pipe(take(this.timeLeft))
      .subscribe({
        next: () => {
          this.timeLeft--;
          this.quizService.updateTimer(this.timeLeft);
        },
        complete: () => {
          // Si le temps est écoulé et qu'aucune réponse n'a été soumise
          if (!this.answerSubmitted) {
            // Sélectionner automatiquement une réponse incorrecte ou la première réponse
            if (this.currentQuestion && this.currentQuestion.all_answers) {
              const incorrectAnswer = this.currentQuestion.all_answers.find(
                answer => answer !== this.currentQuestion?.correct_answer
              ) || this.currentQuestion.all_answers[0];
              
              this.selectedAnswer = incorrectAnswer;
              this.submitAnswer();
            }
          }
        }
      });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }
}
