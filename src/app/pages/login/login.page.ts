import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        alert('Connexion réussie');
        this.router.navigate(['/tabs']);
      },
      error: () => {
        alert('Échec de la connexion. Vérifie les informations.');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}