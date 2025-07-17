import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { MoviesService } from './movies.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Result } from './movies.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let moviesServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    moviesServiceMock = {
      getMovies: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        MoviesComponent,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        CommonModule
      ],
      providers: [
        { provide: MoviesService, useValue: moviesServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;

    jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies and initialize filteredOptions on getMovies', async () => {
    const mockResults: Result[] = [
      { id: 1, title: 'Alpha', poster_path: '/a.jpg' },
      { id: 2, title: 'Beta', poster_path: '/b.jpg' },
      { id: 3, title: 'Gamma', poster_path: '/g.jpg' },
    ];
    const mockResponse = { results: mockResults };

    moviesServiceMock.getMovies.mockReturnValue(of(mockResponse));

    component.getMovies();

    component.searchControl.setValue('al');

    const options = await firstValueFrom(component.filteredOptions!);

    expect(options).toContain('Alpha');
  });

  it('should filter movies on applyFilter', () => {
    component.allMovies = [
      { id: 1, title: 'Alpha', poster_path: '/a.jpg' },
      { id: 2, title: 'Beta', poster_path: '/b.jpg' },
      { id: 3, title: 'Gamma', poster_path: '/g.jpg' },
    ];

    component.applyFilter('al');
    expect(component.movies.length).toBe(1);
    expect(component.movies[0].title).toBe('Alpha');

    component.applyFilter('be');
    expect(component.movies.length).toBe(1);
    expect(component.movies[0].title).toBe('Beta');

    component.applyFilter('xyz');
    expect(component.movies.length).toBe(0);
  });

  it('should navigate to details and save movie in localStorage on navigateToDetails', () => {
    const movie: Result = { id: 123, title: 'My Movie', poster_path: '/mp.jpg' };

    component.navigateToDetails(movie);

    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedMovie', JSON.stringify(movie));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/details']);
  });

  it('should call getMovies and subscribe to searchControl valueChanges on ngOnInit', fakeAsync(() => {
    const mockResults: Result[] = [{ id: 1, title: 'Movie', poster_path: '/p.jpg' }];
    const mockResponse = { results: mockResults };
    moviesServiceMock.getMovies.mockReturnValue(of(mockResponse));

    const applyFilterSpy = jest.spyOn(component, 'applyFilter');

    component.ngOnInit();
    tick();

    expect(moviesServiceMock.getMovies).toHaveBeenCalled();
    expect(component.allMovies).toEqual(mockResults);
    expect(component.movies).toEqual(mockResults);

    component.searchControl.setValue('mov');
    expect(applyFilterSpy).toHaveBeenCalledWith('mov');
  }));
});
