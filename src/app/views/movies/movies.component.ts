import { Component, OnInit } from '@angular/core';
import { MoviesService } from './movies.service';
import { Result } from './movies.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit {
  searchControl = new FormControl('');
  filteredOptions!: Observable<string[]>;
  allMovies: Result[] = [];
  movies: Result[] = [];

  constructor(private service: MoviesService, private router: Router) { }

  ngOnInit() {
    this.getMovies();

    this.searchControl.valueChanges.pipe(startWith('')).subscribe(value => {
      this.applyFilter(value || '');
    });
  }

  getMovies() {
    this.service.getMovies().subscribe(response => {
      this.allMovies = response.results ?? [];
      this.movies = [...this.allMovies];

      const movieTitles = this.allMovies.map(movie => movie.title ?? '');
      this.filteredOptions = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const filterValue = value?.toLowerCase() || '';
          return movieTitles.filter(title =>
            title.toLowerCase().includes(filterValue)
          );
        })
      );
    });
  }

  applyFilter(value: string) {
    const filterValue = value.toLowerCase();
    this.movies = this.allMovies.filter(movie =>
      (movie.title ?? '').toLowerCase().includes(filterValue)
    );
  }

  navigateToDetails(movie: Result) {
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    this.router.navigate(['/details']);
  }
}
