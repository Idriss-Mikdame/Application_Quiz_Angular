import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getQuestions(category?: number, difficulty?: string): Observable<any> {
    let url = `https://opentdb.com/api.php?amount=5`;
  
    if (category) {
      url += `&category=${category}`;
    }
  
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }
  
    url += `&type=multiple`;
  
    return this.http.get<any>(url);
    
  }
  
  
  
}
