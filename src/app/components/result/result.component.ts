import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { StorageService, QuizResult } from '../../services/storage.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-result',
  standalone: false,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  score = 0;
  totalQuestions = 0;
  scorePercentage = 0;
  totalTime = 0;
  category = '';
  difficulty = '';
  resultSaved = false;
  saveForm: FormGroup;

  constructor(
    private quizService: QuizService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.saveForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    // Récupérer les données du quiz depuis sessionStorage
    const scoreStr = sessionStorage.getItem('quizScore');
    const totalStr = sessionStorage.getItem('quizTotal');
    const timeStr = sessionStorage.getItem('quizTime');

    if (!scoreStr || !totalStr) {
      // Rediriger vers l'accueil si aucun résultat n'est disponible
      this.router.navigate(['/']);
      return;
    }

    this.score = parseInt(scoreStr, 10);
    this.totalQuestions = parseInt(totalStr, 10);
    this.totalTime = timeStr ? parseInt(timeStr, 10) : 0;
    this.scorePercentage = Math.round((this.score / this.totalQuestions) * 100);

    // Récupérer les informations sur la catégorie et la difficulté depuis le service
    this.quizService.currentQuestions$.pipe(take(1)).subscribe(questions => {
      if (questions.length > 0) {
        this.category = questions[0].category;
        this.difficulty = questions[0].difficulty;
      }
    });

    // Pré-remplir le nom d'utilisateur s'il existe dans localStorage
    const lastUsername = localStorage.getItem('lastUsername');
    if (lastUsername) {
      this.saveForm.patchValue({ username: lastUsername });
    }
  }

  saveResult(): void {
    if (this.saveForm.invalid) {
      return;
    }

    const username = this.saveForm.value.username;
    
    // Sauvegarder le nom d'utilisateur pour une utilisation future
    localStorage.setItem('lastUsername', username);

    // Créer l'objet de résultat
    const result: QuizResult = {
      username,
      category: this.category,
      difficulty: this.difficulty,
      score: this.score,
      totalQuestions: this.totalQuestions,
      date: new Date(),
      timeSpent: this.totalTime
    };

    // Ajouter le résultat à l'historique
    this.storageService.addResult(result);
    this.resultSaved = true;
  }

  playAgain(): void {
    // Rediriger vers la page d'accueil pour démarrer un nouveau quiz
    this.router.navigate(['/']);
  }

  getFeedbackMessage(): string {
    if (this.scorePercentage >= 80) {
      return 'Excellent ! Vous êtes un expert !';
    } else if (this.scorePercentage >= 60) {
      return 'Très bien ! Vous avez de bonnes connaissances !';
    } else if (this.scorePercentage >= 40) {
      return 'Pas mal ! Continuez à apprendre !';
    } else {
      return 'Continuez à pratiquer pour améliorer vos connaissances !';
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
}
