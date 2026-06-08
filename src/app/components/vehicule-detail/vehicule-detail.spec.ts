import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VehiculeDetailComponent } from './vehicule-detail';

describe('VehiculeDetailComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeDetailComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(VehiculeDetailComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
