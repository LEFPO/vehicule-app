import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EntretienFormComponent } from './entretien-form';

describe('EntretienFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EntretienFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
