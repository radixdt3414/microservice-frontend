import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-component.html',
  styleUrl: './signup-component.css'
})
export class SignupComponent {
 signupForm: FormGroup;

  constructor(private fb: FormBuilder,     private authService: AuthService,     private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const payload = this.signupForm.value;
      console.log('Submitting payload:', payload);

      this.authService.signup(payload).subscribe({
        next: res => {
          if(res.isSuccess){
            alert(`🔥 Welcome, ${payload.firstName}! Signup successful!`);
            this.router.navigate(['/login']); // redirect to  login
          }
          else{
            alert('❌ Login failed! Please check your credentials.');
          }
          
        },
        error: err => {
          alert('❌ Login failed! Please check your credentials.');
        }
      });
     
    } else {
      alert('Please fill all required fields correctly!');
    }
  }
}
