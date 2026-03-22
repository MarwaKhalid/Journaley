import { Component } from '@angular/core';
import { TextButton } from '../../components/buttons/text-button/text-button';
import { InputField } from '../../components/input-field/input-field';

@Component({
  selector: 'app-register',
  imports: [TextButton, InputField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name: string = '';
  email: string = '';
  password: string = '';
  confirm_password: string = '';

  onClick() {
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Confirm Password:', this.confirm_password);
  }
}
