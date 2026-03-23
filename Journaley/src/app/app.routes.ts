import { Routes } from '@angular/router';
import { Home } from './screens/home/home';
import { Login } from './screens/login/login';
import { Register } from './screens/register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
