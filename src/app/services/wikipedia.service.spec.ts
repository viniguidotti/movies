import { TestBed } from '@angular/core/testing';
import { WikipediaService } from './wikipedia.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

declare global {
  interface Window {
    electronAPI: {
      openExternal: (url: string) => void;
    };
  }
}

describe('WikipediaService', () => {
  let service: WikipediaService;
  let httpMock: HttpTestingController;
  let openExternalSpy: jest.SpyInstance;

  beforeEach(() => {
    (global as any).window = {
      electronAPI: {
        openExternal: jest.fn()
      }
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WikipediaService]
    });

    service = TestBed.inject(WikipediaService);
    httpMock = TestBed.inject(HttpTestingController);

    Object.defineProperty(window, 'electronAPI', {
      writable: true,
      value: {
        openExternal: jest.fn(),
      },
    });


    openExternalSpy = jest.spyOn(window.electronAPI, 'openExternal');
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should open fallback Wikipedia URL if imdbId is null', async () => {
    await service.openWikipedia(null, 'Lilo & Stitch');
    expect(openExternalSpy).toHaveBeenCalledWith('https://en.wikipedia.org/w/index.php?search=Lilo%20%26%20Stitch');
  });

  it('should open article URL if SPARQL query returns a valid article', async () => {
    const mockArticleUrl = 'https://en.wikipedia.org/wiki/Lilo_%26_Stitch';

    service.openWikipedia('tt1234567', 'Lilo & Stitch');

    const req = httpMock.expectOne((request) =>
      request.url.startsWith('https://query.wikidata.org/sparql')
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      results: {
        bindings: [
          {
            article: {
              value: mockArticleUrl
            }
          }
        ]
      }
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(openExternalSpy).toHaveBeenCalledWith(mockArticleUrl);
  });

  it('should open fallback URL if SPARQL query returns no results', async () => {
    service.openWikipedia('tt1234567', 'Lilo & Stitch');

    const req = httpMock.expectOne((request) =>
      request.url.startsWith('https://query.wikidata.org/sparql')
    );
    expect(req.request.method).toBe('GET');

    req.flush({ results: { bindings: [] } });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(openExternalSpy).toHaveBeenCalledWith(
      'https://en.wikipedia.org/w/index.php?search=Lilo%20%26%20Stitch'
    );
  });

  it('should open fallback URL if HTTP request fails', async () => {
    service.openWikipedia('tt1234567', 'Lilo & Stitch');

    const req = httpMock.expectOne((request) =>
      request.url.startsWith('https://query.wikidata.org/sparql')
    );

    req.error(new ErrorEvent('Network error'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(openExternalSpy).toHaveBeenCalledWith(
      'https://en.wikipedia.org/w/index.php?search=Lilo%20%26%20Stitch'
    );
  });
});
