import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import { ServicesModule } from '../services.module';

@Injectable({
  providedIn: ServicesModule
})
export class LoginGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}


  canActivate(): boolean {
    if (this.usuarioService.autenticado()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
