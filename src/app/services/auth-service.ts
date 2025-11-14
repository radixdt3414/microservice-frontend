import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import { API } from '../common/endpoint';
import { CartService } from './cart-service';

interface SignupPayload {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  UserName: string;
  Password: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  unique_name: string;
  name: string;
  exp: number;
  iss: string;
  aud: string;
  jti: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<JwtPayload | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private cartService: CartService) {
    const token = localStorage.getItem('token');
    if (token) this.setUserFromToken(token);
  }

  signup(payload: SignupPayload): Observable<{isSuccess:boolean}> {
    return this.http.post<{isSuccess:boolean}>(API.AUTH.SIGNUP, payload);
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post<{ token: string }>(API.AUTH.LOGIN, payload)
      .pipe(
        map(res => {
          console.log("Login: ", res)
          if (res.token) {
            localStorage.setItem('token', res.token);
            this.setUserFromToken(res.token);
          }
          return res;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  private setUserFromToken(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("-----------> user: ", decoded);
      this.currentUserSubject.next(decoded);
    } catch (err) {
      console.error('Failed to decode token', err);
      this.logout();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
