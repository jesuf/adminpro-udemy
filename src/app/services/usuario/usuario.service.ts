import { Injectable } from '@angular/core';
import { ServicesModule } from '../services.module';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UploadService } from '../upload/upload.service';

@Injectable({
  providedIn: ServicesModule
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(private httpClient: HttpClient, private router: Router, private uploadService: UploadService) {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.token = localStorage.getItem('token');
    }
  }

  obtenerUsuarios(desde: number = 0) {

    const url = URL_SERVICIOS + '/usuarios?desde=' + desde;

    return this.httpClient.get(url);
  }
  buscarUsuarios(termino: string = '') {

    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios?termino=' + termino;

    return this.httpClient.get(url);
  }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuarios';

    return this.httpClient.post(url, usuario);
  }
  eliminarUsuario(usuarioId: string) {

    const url = URL_SERVICIOS + '/usuarios/' + usuarioId + '?token=' + this.token;

    return this.httpClient.delete(url);
  }


  actualizarDatosUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuarios/' + usuario._id + '?token=' + this.token;

    return this.httpClient.put(url, usuario).pipe(
                                              map((resp: any) => {
                                                // si el usuario que hemos actualizado es el nuestro, actualizamos el objeto usuario y
                                                // lo guardamos en el localStorage
                                                if (this.usuario._id === usuario._id) {
                                                  this.usuario = resp.usuarioActualizado;
                                                  localStorage.setItem('usuario', JSON.stringify(this.usuario));
                                                }
                                              })
                                            );
  }

  actualizarImagenUsuario(imagen: File) {
    return this.uploadService.subirArchivo(imagen, 'usuarios', this.usuario._id).pipe(
      map((resp: any) => {
        // Estas respuestas de evento se pueden utilizar para muchos fines aunque en este caso no nos interesa mas que el cuerpo final
        // pero lo dejamos así para saber donde recurrir cuando sea menester
        switch (resp.type) {
          // La petición ha sido enviada (tipo 0)
          case HttpEventType.Sent:
            break;
          // Recibimos progreso de nuestra subida (tipo 1)
          case HttpEventType.UploadProgress:
            break;
          // Recibimos las cabeceras de la respuesta cuando la subida ya ha finalizado (tipo 2)
          case HttpEventType.ResponseHeader:
            break;
          // Recibimos progreso de la descarga de la respuesta (tipo 3)
          case HttpEventType.DownloadProgress:
            break;
          // Recibimos el cuerpo de la respuesta (tipo 4)
          case HttpEventType.Response:
            this.usuario.img = resp.body.usuario.img;
            localStorage.setItem('usuario', JSON.stringify(this.usuario));
            break;
        }
        return null;
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  loginUsuario(usuario: Usuario, recordar: boolean) {

    const url = URL_SERVICIOS + '/login';

    return this.httpClient.post(url, usuario).pipe(
                                                map((resp: any) => {
                                                  this.guardarToken(resp.token, resp.usuario, resp.expira, recordar);
                                                  return null;
                                                }),
                                                catchError(err => {
                                                  if (err.status === 0) {
                                                    err.error.mensaje = 'Server is likely offline';
                                                  }
                                                  throw err;
                                                })
                                              );
  }

  loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    // lo mandado ha de ser siempre un objeto, por lo que englobamos el token en un objeto que tendria token: token pero como es redundante
    // se pone solo token
    return this.httpClient.post(url, {token}).pipe(
                                                map((resp: any) => {
                                                  this.guardarToken(resp.token, resp.usuario, resp.expira);
                                                  return null;
                                                }),
                                                catchError(err => {
                                                  if (err.status === 0) {
                                                    err.error.mensaje = 'Server is likely offline';
                                                  }
                                                  throw err;
                                                })
                                              );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.token = null;

    this.router.navigateByUrl('/login');
  }



  private guardarToken(token: string, usuario: Usuario, expira: number, recordar: boolean = false) {

    // Recordamos el email del usuario en el localStorage solo si la opcion fue marcada, y si esta desmarcada, intentamos borrarlo
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    // Además, el usuario lo vamos a asignar a nuestra variable global para tener acceso a sus datos en todo momento desde cualquier
    // componente que implemente el servicio
    this.usuario = usuario;
    // y el token tambien, porque lo vamos a usar varias veces y es mejor que estar leyendolo cada vez
    this.token = token;

    const hoy = new Date();
    // le sumamos el tiempo de expiracion a la fecha actual, es decir dentro de una hora.
    hoy.setSeconds(expira);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  autenticado() {
    if (!this.token) {
      return false;
    }

    const expira = new Date((Number(localStorage.getItem('expira'))));
    if (expira < new Date()) {
      return false;
    }

    return true;
  }
}
