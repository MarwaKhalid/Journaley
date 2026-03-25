import { Component, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { InputField } from '../../components/input-field/input-field';
import { API_BASE_URL } from '../../core/api.config';
import { AuthService } from '../../core/auth.service';

interface RegisterResponse {
  token: string;
}

interface ErrorBody {
  error?: string;
}

@Component({
  selector: 'app-register',
  imports: [TextButton, InputField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  submitting = false;

  onSubmit() {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const name = this.name.trim();
    const email = this.email.trim();
    if (!name || !email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.submitting = true;
    this.http
      .post<RegisterResponse>(`${API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      })
      .subscribe({
        next: (res) => {
          this.auth.setToken(res.token);
          void this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          this.submitting = false;
          const body = err.error as ErrorBody | undefined;
          this.errorMessage = body?.error ?? err.message ?? 'Registration failed.';
        },
      });
  }
}
