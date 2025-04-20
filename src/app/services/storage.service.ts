import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface QuizResult {
  username: string;
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  date: Date;
  timeSpent?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'quiz_history';
  private historySubject = new BehaviorSubject<QuizResult[]>([]);
  history$ = this.historySubject.asObservable();

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    const storedHistory = localStorage.getItem(this.STORAGE_KEY);
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        // Convertir les chaînes de date en objets Date
        const formattedHistory = history.map((result: any) => ({
          ...result,
          date: new Date(result.date)
        }));
        this.historySubject.next(formattedHistory);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique', error);
        this.historySubject.next([]);
      }
    } else {
      this.historySubject.next([]);
    }
  }

  private saveHistory(history: QuizResult[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.historySubject.next(history);
  }

  addResult(result: QuizResult): void {
    const currentHistory = this.historySubject.value;
    const updatedHistory = [...currentHistory, result];
    this.saveHistory(updatedHistory);
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.historySubject.next([]);
  }

  getHistory(): QuizResult[] {
    return this.historySubject.value;
  }
}
