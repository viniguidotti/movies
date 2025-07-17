import { Component } from '@angular/core';
import { MoviesComponent } from "../movies/movies.component";

@Component({
  selector: 'app-home',
  imports: [MoviesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
