import { TestBed } from '@angular/core/testing';

import { HttpClientErrorInterceptor } from './http-client-error.interceptor';

describe('HttpClientErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClientErrorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpClientErrorInterceptor = TestBed.inject(HttpClientErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
