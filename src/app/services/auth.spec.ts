import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // ── REGISTER ───────────────────────────────────────────

  it('should register and store token in localStorage', () => {
    const mockResponse = {
      token: 'jwt-token',
      email: 'jean.dupont@email.com',
      nom: 'Jean Dupont',
    };

    service
      .register({
        nom: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        motDePasse: 'password123',
      })
      .subscribe((response) => {
        expect(response.token).toBe('jwt-token');
        expect(localStorage.getItem('token')).toBe('jwt-token');
        expect(localStorage.getItem('email')).toBe('jean.dupont@email.com');
        expect(localStorage.getItem('nom')).toBe('Jean Dupont');
      });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // ── LOGIN ──────────────────────────────────────────────

  it('should login and store token in localStorage', () => {
    const mockResponse = {
      token: 'jwt-token',
      email: 'jean.dupont@email.com',
      nom: 'Jean Dupont',
    };

    service
      .login({
        email: 'jean.dupont@email.com',
        motDePasse: 'password123',
      })
      .subscribe((response) => {
        expect(response.token).toBe('jwt-token');
        expect(localStorage.getItem('token')).toBe('jwt-token');
      });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // ── LOGOUT ─────────────────────────────────────────────

  it('should clear localStorage on logout', () => {
    localStorage.setItem('token', 'jwt-token');
    localStorage.setItem('email', 'jean.dupont@email.com');
    localStorage.setItem('nom', 'Jean Dupont');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
    expect(localStorage.getItem('nom')).toBeNull();
  });

  // ── IS LOGGED IN ───────────────────────────────────────

  it('should return true when token exists', () => {
    localStorage.setItem('token', 'jwt-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false when token does not exist', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  // ── GET NOM / EMAIL ────────────────────────────────────

  it('should return nom from localStorage', () => {
    localStorage.setItem('nom', 'Jean Dupont');
    expect(service.getNom()).toBe('Jean Dupont');
  });

  it('should return empty string when nom not in localStorage', () => {
    expect(service.getNom()).toBe('');
  });

  it('should return email from localStorage', () => {
    localStorage.setItem('email', 'jean.dupont@email.com');
    expect(service.getEmail()).toBe('jean.dupont@email.com');
  });
});
