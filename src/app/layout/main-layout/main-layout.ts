import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header';  
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,  
  imports: [
    RouterModule,    
    HeaderComponent
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

   logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}