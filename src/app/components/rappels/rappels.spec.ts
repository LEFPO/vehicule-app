import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RappelsComponent } from './rappels';

describe('RappelsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RappelsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RappelsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
