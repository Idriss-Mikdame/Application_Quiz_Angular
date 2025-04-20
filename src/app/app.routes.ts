import { Routes } from '@angular/router';
import {HistoryComponent} from './components/history/history.component';
import {QuizComponent} from './components/quiz/quiz.component';
import {HomeComponent} from './components/home/home.component';
import {ResultComponent} from './components/resoult/resoult.component';



export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'result', component: ResultComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '' }
];
