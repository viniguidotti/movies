import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MovieDetailsComponent } from './movie-details.component';
import { WikipediaService } from '../../services/wikipedia.service';
import { of } from 'rxjs';
import { Result } from '../../views/movies/movies.model';
import { Credits } from './credits.model';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MoviesDetailsService } from './movie-details.service';
import { Router } from '@angular/router';

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let serviceMock: any;
  let wikipediaServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    serviceMock = {
      getMovieCreditsById: jest.fn()
    };
    wikipediaServiceMock = {
      openWikipedia: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MovieDetailsComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: MoviesDetailsService, useValue: serviceMock },
        { provide: WikipediaService, useValue: wikipediaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    jest.spyOn(window.localStorage['__proto__'], 'getItem').mockImplementation(() => null);
    jest.spyOn(window.localStorage['__proto__'], 'removeItem').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load movie from localStorage and fetch credits on init', () => {
    const mockMovie: Result = { id: 42, title: 'Test Movie', poster_path: '/test.jpg' };
    (window.localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockMovie));
    const mockCredits: Credits = { cast: [], crew: [] };
    serviceMock.getMovieCreditsById.mockReturnValue(of(mockCredits));

    component.ngOnInit();

    expect(window.localStorage.getItem).toHaveBeenCalledWith('selectedMovie');
    expect(component.movie).toEqual(mockMovie);
    expect(serviceMock.getMovieCreditsById).toHaveBeenCalledWith('42');
    expect(component.imageUrl).toContain(mockMovie.poster_path);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to home if no movie in localStorage', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    component.ngOnInit();

    expect(component.movie).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log error if no movie found', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('No movie found in local storage');
  });

  it('should call wikipediaService.openWikipedia with correct params on onOpenWikipedia', fakeAsync(() => {
    component.movie = { id: 123, title: 'Movie Title', poster_path: '' };
    wikipediaServiceMock.openWikipedia.mockResolvedValue(undefined);

    component.onOpenWikipedia();
    tick();

    expect(wikipediaServiceMock.openWikipedia).toHaveBeenCalledWith('123', 'Movie Title');
  }));

  it('should log error if wikipediaService.openWikipedia rejects', fakeAsync(() => {
    component.movie = { id: 123, title: 'Movie Title', poster_path: '' };
    const error = new Error('fail');
    wikipediaServiceMock.openWikipedia.mockRejectedValue(error);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    component.onOpenWikipedia();
    tick();

    expect(wikipediaServiceMock.openWikipedia).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error opening Wikipedia:', error);
  }));

  it('should log error if movie id is missing on onOpenWikipedia', () => {
    component.movie = { id: undefined as any, title: 'Movie Title', poster_path: '' };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    component.onOpenWikipedia();

    expect(consoleErrorSpy).toHaveBeenCalledWith('IMDB ID not found for the movie');
    expect(wikipediaServiceMock.openWikipedia).not.toHaveBeenCalled();
  });

  it('should clear localStorage and properties on ngOnDestroy', () => {
    component.movie = { id: 1, title: 'a', poster_path: '' };
    component.movieDetails = { cast: [], crew: [] };

    component.ngOnDestroy();

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('selectedMovie');
    expect(component.movie).toBeNull();
    expect(component.movieDetails).toBeNull();
  });

  it('should set movieDetails when getMovieCreditsById is called', () => {
    const mockCredits: Credits = { cast: [], crew: [] };
    serviceMock.getMovieCreditsById.mockReturnValue(of(mockCredits));

    component.getMovieCreditsById('999');

    expect(serviceMock.getMovieCreditsById).toHaveBeenCalledWith('999');
  });
});
