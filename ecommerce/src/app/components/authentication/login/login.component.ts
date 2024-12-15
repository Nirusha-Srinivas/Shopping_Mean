import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:[ './login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private authService: AuthService, private router: Router,private snackBar: MatSnackBar) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (user:any) => {
        if (user.role === 'admin') {
          this.snackBar.open('Admin login successful!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'snackbar-success',
          });
          this.router.navigate(['/admin/dashboard']); // Navigate to the admin dashboard
        } else {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'snackbar-success',
          });
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.snackBar.open('Invalid credentials, please try again.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'snackbar-error',
        });
      }
    );
  }
}
