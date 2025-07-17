import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MoviesService } from './movies.service';
import { Movies, OriginalLanguage } from './movies.model';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService],
    });

    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch movies successfully', (done) => {
    const mockMovies: Movies = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Movie 1',
          poster_path: '/path1.jpg',
          overview: 'Overview 1',
          release_date: new Date('2023-01-01'),
          backdrop_path: '/backdrop1.jpg',
          vote_average: 8.5,
          genre_ids: [12, 35],
          adult: false,
          original_language: OriginalLanguage.En,
          original_title: 'Original Movie 1',
          popularity: 10,
          video: false,
          vote_count: 100,
        },
        {
          id: 2,
          title: 'Movie 2',
          poster_path: '/path2.jpg',
          overview: 'Overview 2',
          release_date: new Date('2023-02-01'),
          backdrop_path: '/backdrop2.jpg',
          vote_average: 7.2,
          genre_ids: [28, 53],
          adult: false,
          original_language: OriginalLanguage.Nl,
          original_title: 'Original Movie 2',
          popularity: 20,
          video: false,
          vote_count: 50,
        },
      ],
      total_pages: 1,
      total_results: 2,
    };

    service.getMovies().subscribe(movies => {
      movies.results?.forEach((r, i) => {
        if (r.release_date) {
          r.release_date = new Date(r.release_date);
        }
      });
      expect(movies).toEqual(mockMovies);
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/movies');
    expect(req.request.method).toBe('GET');

    const mockResponse = {
      ...mockMovies,
      results: mockMovies.results?.map(r => ({
        ...r,
        release_date: r.release_date?.toISOString(),
      })),
    };

    req.flush(mockResponse);
  });

  it('should handle error when getMovies fails', (done) => {
    const mockError = { status: 500, statusText: 'Server Error' };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    service.getMovies().subscribe({
      next: () => {
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching movies:', expect.anything());
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/movies');
    expect(req.request.method).toBe('GET');
    req.flush(null, mockError);
  });
});
