import { Component } from '@angular/core';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { InputField } from '../../components/input-field/input-field';

@Component({
  selector: 'app-login',
  imports: [TextButton, InputField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  onClick() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
