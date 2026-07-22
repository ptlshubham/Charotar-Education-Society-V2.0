import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export type UserRole = 'admin' | 'brand' | 'influencer';

export interface AuthUser {
  userId:   number;
  email:    string;
  name:     string;
  role:     UserRole;
  theme:    'light' | 'dark';
}

const ROLE_REDIRECT: Record<UserRole, string> = {
  admin:      '/dashboard',
  brand:      '/brand/dashboard',
  influencer: '/influencer/dashboard',
};

const TOKEN_KEY = 'zarklyx_token';
const USER_KEY  = 'zarklyx_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isSwitchingProfile = false;

  /** No session storage on the server  SSR always resolves to logged-out. */
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  logout(reason?: string): void {
    const token = this.getToken();
    if (token) {
      // this.http.post(ApiService.LogoutURL, { token }).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      // Corrupt payload shouldn't hard-fail every consumer of getUser().
      return null;
    }
  }

  getRole(): UserRole | null {
    return this.getUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean      { return this.getRole() === 'admin'; }
  isBrand(): boolean      { return this.getRole() === 'brand'; }
  isInfluencer(): boolean { return this.getRole() === 'influencer'; }

  redirectByRole(role: UserRole): void {
    const path = ROLE_REDIRECT[role] ?? '/login';
    this.router.navigate([path]);
  }
}
