import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { IUser } from './models/navbar-component.model';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterModule, AsyncPipe, CommonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {
  currentUserSubject$ = new BehaviorSubject<IUser | null>(null);
  dropdownOpen = false;

  constructor(private authService: AuthService) { 

    authService.currentUser$.subscribe((data)=>{
        if(data != null){
            this.currentUserSubject$.next({
                id: data.sub,
                fullName: data.name,
                userName: data.unique_name,
                email: data.email
            });
        }
    })
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false;
  }
}
