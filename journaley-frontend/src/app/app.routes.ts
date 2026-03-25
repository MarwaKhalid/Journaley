import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { Home } from './screens/home/home';
import { Login } from './screens/login/login';
import { Register } from './screens/register/register';
import { TripHighlights } from './screens/trip-highlights/trip-highlights';
import { TripSketchbook } from './screens/trip-sketchbook/trip-sketchbook';

export const routes: Routes = [
  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'trip-highlights/:countryKey', component: TripHighlights, canActivate: [authGuard] },
  { path: 'trip-highlights', component: TripHighlights, canActivate: [authGuard] },
  { path: 'trip-sketchbook/:tripId', component: TripSketchbook, canActivate: [authGuard] },
  { path: 'trip-sketchbook', component: TripSketchbook, canActivate: [authGuard] },
];
