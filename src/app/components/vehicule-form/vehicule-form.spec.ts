import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VehiculeFormComponent } from './vehicule-form';

describe('VehiculeFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeFormComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(VehiculeFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
