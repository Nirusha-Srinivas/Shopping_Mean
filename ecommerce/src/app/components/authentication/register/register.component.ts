import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  isAdmin: boolean = false;
  showAdminOption: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.showAdminOption = this.router.url === '/register/admin';
    this.isAdmin = this.showAdminOption;
  }

  ngOnInit() {
    // Any additional initialization logic
  }

  onSubmit() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin
    };

    this.authService.register(userData).subscribe(
      (response: any) => {
        if (response && response.message === 'User already exists') {
          this.snackBar.open('User already exists. Please use a different email.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
        } else {
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'snackbar-success',
            
          });
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.snackBar.open('Registration failed, please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'snackbar-error',
        });
      }
    );
  }


}
