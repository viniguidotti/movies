import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MoviesDetailsService } from './movie-details.service';
import { Credits } from './credits.model';
import { Result } from '../../views/movies/movies.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WikipediaService } from '../../services/wikipedia.service';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  constructor(private router: Router, private service: MoviesDetailsService, private wikipediaService: WikipediaService) { }

  movie: Result | null = null;
  movieDetails: Credits | null = null;
  imageUrl = 'https://image.tmdb.org/t/p/w500/';

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedMovie');
    this.movie = stored ? JSON.parse(stored) : null;
    if (this.movie) {
      this.getMovieCreditsById(String(this.movie.id));
    } else {
      console.error('No movie found in local storage');
    }

    this.imageUrl += (this.movie?.poster_path || '');

    if (!this.movie) {
      this.router.navigate(['/']);
    }
  }

  onOpenWikipedia(): void {
    if (this.movie?.id) {
      this.wikipediaService.openWikipedia(String(this.movie.id), this.movie.title).catch(error => {
        console.error('Error opening Wikipedia:', error);
      });
    } else {
      console.error('IMDB ID not found for the movie');
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('selectedMovie');
    this.movie = null;
    this.movieDetails = null;
  }

  getMovieCreditsById(id: string) {
    this.service.getMovieCreditsById(id).subscribe(credits => {
      this.movieDetails = credits;
    });
  }
}
