import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
}

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  // Propriétés ajoutées pour la gestion du quiz
  all_answers?: string[];
  selected_answer?: string;
  is_correct?: boolean;
}

export interface QuizConfig {
  amount: number;
  category?: number;
  difficulty?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'https://opentdb.com/api.php';
  private categoryUrl = 'https://opentdb.com/api_category.php';
  
  private currentQuestionsSubject = new BehaviorSubject<QuizQuestion[]>([]);
  currentQuestions$ = this.currentQuestionsSubject.asObservable();
  
  private currentIndexSubject = new BehaviorSubject<number>(0);
  currentIndex$ = this.currentIndexSubject.asObservable();
  
  private scoreSubject = new BehaviorSubject<number>(0);
  score$ = this.scoreSubject.asObservable();
  
  private timerSubject = new BehaviorSubject<number>(0);
  timer$ = this.timerSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<{trivia_categories: Category[]}>(this.categoryUrl)
      .pipe(
        map(response => response.trivia_categories)
      );
  }

  getQuizQuestions(config: QuizConfig): Observable<QuizQuestion[]> {
    let url = `${this.baseUrl}?amount=${config.amount}`;
    
    if (config.category && config.category > 0) {
      url += `&category=${config.category}`;
    }
    
    if (config.difficulty && config.difficulty !== 'any') {
      url += `&difficulty=${config.difficulty}`;
    }
    
    if (config.type && config.type !== 'any') {
      url += `&type=${config.type}`;
    }
    
    return this.http.get<{response_code: number, results: QuizQuestion[]}>(url)
      .pipe(
        map(response => {
          if (response.response_code !== 0) {
            throw new Error(`API Error: Response code ${response.response_code}`);
          }
          
          // Préparer les questions pour l'affichage
          return response.results.map(question => {
            const all_answers = [...question.incorrect_answers, question.correct_answer];
            // Mélanger les réponses
            this.shuffleArray(all_answers);
            
            return {
              ...question,
              all_answers
            };
          });
        })
      );
  }

  startQuiz(questions: QuizQuestion[]): void {
    this.currentQuestionsSubject.next(questions);
    this.currentIndexSubject.next(0);
    this.scoreSubject.next(0);
    this.timerSubject.next(0);
  }

  getCurrentQuestion(): QuizQuestion | null {
    const questions = this.currentQuestionsSubject.value;
    const index = this.currentIndexSubject.value;
    
    if (questions.length > 0 && index < questions.length) {
      return questions[index];
    }
    
    return null;
  }

  answerQuestion(answer: string): boolean {
    const questions = this.currentQuestionsSubject.value;
    const index = this.currentIndexSubject.value;
    
    if (questions.length > 0 && index < questions.length) {
      const question = questions[index];
      const isCorrect = answer === question.correct_answer;
      
      // Mettre à jour la question avec la réponse sélectionnée
      questions[index] = {
        ...question,
        selected_answer: answer,
        is_correct: isCorrect
      };
      
      // Mettre à jour le score si la réponse est correcte
      if (isCorrect) {
        this.scoreSubject.next(this.scoreSubject.value + 1);
      }
      
      this.currentQuestionsSubject.next([...questions]);
      return isCorrect;
    }
    
    return false;
  }

  nextQuestion(): boolean {
    const currentIndex = this.currentIndexSubject.value;
    const questions = this.currentQuestionsSubject.value;
    
    if (currentIndex < questions.length - 1) {
      this.currentIndexSubject.next(currentIndex + 1);
      return true;
    }
    
    return false;
  }

  getScore(): number {
    return this.scoreSubject.value;
  }

  getProgress(): number {
    const questions = this.currentQuestionsSubject.value;
    const index = this.currentIndexSubject.value;
    
    if (questions.length === 0) {
      return 0;
    }
    
    return (index + 1) / questions.length;
  }

  updateTimer(seconds: number): void {
    this.timerSubject.next(seconds);
  }

  // Fonction utilitaire pour mélanger un tableau
  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
