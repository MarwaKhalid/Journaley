import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    const email = this.email.trim();
    if (!email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    this.submitting = true;
    this.http
      .post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, { email, password: this.password })
      .subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err: { error?: ErrorBody }) => {
        this.submitting = false;
        this.errorMessage = err?.error?.error ?? 'Login failed. Check your credentials.';
      },
    });
  }
}
