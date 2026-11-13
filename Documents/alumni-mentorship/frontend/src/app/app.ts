import { Component } from '@angular/core';
import { UserSearchComponent } from './components/user-search/user-search.component';

@Component({
  selector: 'app-root',
  imports: [UserSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}