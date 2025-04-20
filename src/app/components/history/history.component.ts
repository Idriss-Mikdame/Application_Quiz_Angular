import { Component, OnInit } from '@angular/core';
import { StorageService, QuizResult } from '../../services/storage.service';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  quizHistory: QuizResult[] = [];
  filteredHistory: QuizResult[] = [];
  searchTerm: string = '';
  sortColumn: string = 'date';
  sortAscending: boolean = false;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    // S'abonner aux changements de l'historique
    this.storageService.history$.subscribe(history => {
      this.quizHistory = history;
      this.applyFilters();
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      // Inverser l'ordre si on clique sur la même colonne
      this.sortAscending = !this.sortAscending;
    } else {
      // Nouvelle colonne, trier par défaut en ordre décroissant
      this.sortColumn = column;
      this.sortAscending = false;
    }
    this.applyFilters();
  }

  clearHistory(): void {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ? Cette action est irréversible.')) {
      this.storageService.clearHistory();
    }
  }

  getScorePercentage(result: QuizResult): number {
    return Math.round((result.score / result.totalQuestions) * 100);
  }

  formatTime(seconds?: number): string {
    if (!seconds) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  private applyFilters(): void {
    // Filtrer par terme de recherche
    let filtered = this.quizHistory;
    
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(result => 
        result.username.toLowerCase().includes(search) ||
        result.category.toLowerCase().includes(search) ||
        result.difficulty.toLowerCase().includes(search)
      );
    }
    
    // Trier les résultats
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      if (this.sortColumn === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (this.sortColumn === 'score') {
        const percentageA = this.getScorePercentage(a);
        const percentageB = this.getScorePercentage(b);
        comparison = percentageA - percentageB;
      }
      
      // Inverser l'ordre si nécessaire
      return this.sortAscending ? comparison : -comparison;
    });
    
    this.filteredHistory = filtered;
  }
}
