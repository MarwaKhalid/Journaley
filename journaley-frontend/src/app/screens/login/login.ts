import { Component, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { InputField } from '../../components/input-field/input-field';
import { API_BASE_URL } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';

interface LoginResponse {
  token: string;
}

interface ErrorBody {
  error?: string;
}

@Component({
  selector: 'app-login',
  imports: [TextButton, InputField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  errorMessage = '';
  submitting = false;

  onSubmit() {
    this.errorMessage = '';
    const email = this.email.trim().toLowerCase();
    if (!email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.submitting = true;
    this.http
      .post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, { email, password: this.password })
      .subscribe({
        next: (res) => {
          if (!res?.token) {
            this.submitting = false;
            this.errorMessage = 'Invalid response from server (no token).';
            return;
          }
          this.auth.setToken(res.token);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
          void this.router.navigateByUrl(returnUrl);
        },
        error: (err: HttpErrorResponse) => {
          this.submitting = false;
          this.errorMessage = this.parseLoginError(err);
        },
      });
  }

  private parseLoginError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return `Cannot reach the API at ${API_BASE_URL}. Is the backend running, and is CORS allowing this page's origin?`;
    }
    const body = err.error;
    if (body && typeof body === 'object' && 'error' in body) {
      return String((body as ErrorBody).error ?? 'Login failed.');
    }
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (err.status === 401) {
      return 'Invalid email or password.';
    }
    return err.message || 'Login failed. Check your credentials.';
  }
}
