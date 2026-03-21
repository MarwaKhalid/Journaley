import { Component } from '@angular/core';
import { TextButton } from '../../components/buttons/text-button/text-button';

@Component({
  selector: 'app-login',
  imports: [TextButton],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
