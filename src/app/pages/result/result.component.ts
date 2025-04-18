import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
  score: number = 0;
  total: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedScore = localStorage.getItem('quiz_score');
    const storedTotal = localStorage.getItem('quiz_total');

    if (storedScore && storedTotal) {
      this.score = Number(storedScore);
      this.total = Number(storedTotal);
    }
  }

  rejouerQuiz() {
    this.router.navigate(['/']);
  }
}
