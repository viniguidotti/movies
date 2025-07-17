import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MoviesDetailsService } from './movie-details.service';
import { Credits } from './credits.model';

describe('MoviesDetailsService', () => {
  let service: MoviesDetailsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesDetailsService]
    });

    service = TestBed.inject(MoviesDetailsService);
    httpMock = TestBed.inject(HttpTestingController);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify(); 
    jest.restoreAllMocks();
  });

  it('should fetch movie credits by ID', (done) => {
    const mockCredits: Credits = {
      cast: [{ name: 'Actor 1', character: 'Role 1' }],
      crew: [{ name: 'Director 1', job: 'Director' }]
    };

    service.getMovieCreditsById('123').subscribe({
      next: (credits) => {
        expect(credits).toEqual(mockCredits);
        done();
      },
      error: () => {
        fail('Expected successful response');
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/movies/123/credits');
    expect(req.request.method).toBe('GET');

    req.flush(mockCredits);
  });

  it('should handle http error', (done) => {
    const mockError = { status: 500, statusText: 'Server Error' };

    service.getMovieCreditsById('123').subscribe({
      next: () => {
        fail('Expected error response');
        done();
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/movies/123/credits');
    req.flush(null, mockError);
  });
});
