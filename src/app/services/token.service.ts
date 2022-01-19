import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  accessToken: any;
  canUseToken: any;
  constructor() {
    if (localStorage.getItem('access_token')) {
      this.accessToken = localStorage.getItem('access_token');
      this.canUseToken = true;
    }
  }

  getToken(): string {
    if (localStorage.getItem('access_token')) {
      this.accessToken = localStorage.getItem('access_token');
    }
    return this.accessToken;
  }

  setToken(token: any): void {
    this.accessToken = `Bearer ${token}`;
    localStorage.setItem('access_token', this.accessToken);
    this.canUseToken = true;
  }

  clearToken(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('authUser');
    this.canUseToken = false;
  }

  checkIfTokenCanBeUsed(): boolean {
    return this.canUseToken;
  }
}
