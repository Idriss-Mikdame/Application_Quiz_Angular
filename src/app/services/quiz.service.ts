import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'https://opentdb.com/api.php';


  constructor(private http: HttpClient) {}

  getQuestions(category: number, difficulty: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`);
  }

  getCategories(): Observable<any> {
    return this.http.get('https://opentdb.com/api_category.php');
  }
}
