import { Injectable } from '@angular/core';
import { ServicesModule } from '../services.module';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: ServicesModule
})
export class UsuarioService {

  // private userToken: string;

  constructor(private httpClient: HttpClient, private router: Router) { }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuarios';

    return this.httpClient.post(url, usuario);
  }

  loginUsuario(usuario: Usuario, recordar: boolean) {

    const url = URL_SERVICIOS + '/login';

    return this.httpClient.post(url, usuario).pipe(
                                                map((resp: any) => {
                                                  this.guardarToken(resp.token, resp.usuario, resp.expira, recordar);
                                                  return null;
                                                })
                                              );
  }

  loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    // tenemos que mandar siempre un objeto, por lo que englobamos el token en un objeto que tendria token: token pero como es redundante
    // se pone solo token
    return this.httpClient.post(url, {token}).pipe(
                                                map((resp: any) => {
                                                  this.guardarToken(resp.token, resp.usuario, resp.expira);
                                                  return null;
                                                })
                                              );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
    localStorage.removeItem('usuario');

    this.router.navigateByUrl('/login');
  }



  private guardarToken(token: string, usuario: Usuario, expira: number, recordar: boolean = false) {

    // Recordamos el email del usuario en el localStorage solo si la opcion fue marcada, y si esta desmarcada, intentamos borrarlo
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    // this.userToken = idToken;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    const hoy = new Date();
    // le sumamos el tiempo de expiracion a la fecha actual, es decir dentro de una hora.
    hoy.setSeconds(expira);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  autenticado() {
    if (!localStorage.getItem('token')) {
      return false;
    }

    const expira = new Date((Number(localStorage.getItem('expira'))));
    if (expira < new Date()) {
      return false;
    }

    return true;
  }
}
