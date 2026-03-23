import { Routes } from '@angular/router';
import { Home } from './screens/home/home';
import { Login } from './screens/login/login';
import { Register } from './screens/register/register';
import { TripHighlights } from './screens/trip-highlights/trip-highlights';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'trip-highlights', component: TripHighlights },
];
