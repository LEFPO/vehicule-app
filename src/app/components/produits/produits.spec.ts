import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProduitsComponent } from './produits';

describe('ProduitsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProduitsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
