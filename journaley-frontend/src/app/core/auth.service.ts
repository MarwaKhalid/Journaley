import { Injectable } from '@angular/core';

const STORAGE_KEY = 'journaley_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  setToken(token: string): void {
    sessionStorage.setItem(STORAGE_KEY, token);
  }

  clearToken(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.clearToken();
  }
}
