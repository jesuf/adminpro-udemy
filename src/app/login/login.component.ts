import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/services.index';

// Debemos declarar que existe una funcion llamada cargar_scripts previamente cargada en un archivo de javascript
// y que queremos usarla en typescript para lo cual debemos asignarle un tipo, any.
declare function cargar_scripts(): any;

// Debemos declarar tb la libreria gapi, que viene de https://apis.google.com/js/platform.js, establecido en el index.html,
// y necesaria para realizar el google sign in.
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login_register.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  username: string;
  recordar: boolean;
  // The Sign-In object.
  auth2: any;

  // Obtenemos una referencia del boton para loguear con Google
  @ViewChild('btnGoogle', {static: false}) btnGoogle: ElementRef;

  constructor(private usuarioService: UsuarioService, private router: Router, private ngZone: NgZone) { }

  ngOnInit() {
    // Llamamos a la función que inicializa los scripts que usa la plantilla.
    // Esta función se encuentra en el arhivo custom.js e inicialmente se ejecutaba sola, pero cuando cargabamos la página
    // en login o register, al no existir los elementos de sidebar, etc, estos no podian inicializarse con su funcionalidad
    // y al navegar a una página como dashboard, no funcionaban. Así, inicializamos en pages, login y register y asunto arreglado.
    cargar_scripts();

    // Si estabamos recordando el email del usuario, lo obtenemos para rellenar el campo y marcamos la casilla de recordar
    if (localStorage.getItem('email')) {
      this.username = localStorage.getItem('email');
      this.recordar = true;
    }
  }
  ngAfterViewInit() {
    // Seteamos todo lo relativo al google sign in.
    this.googleInit();
  }


  login(formulario: NgForm) {

    if (formulario.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: () => !Swal.isLoading(),
      type: 'warning',
      text: 'Espere por favor...',
      onBeforeOpen: () => Swal.showLoading()
    });

    // Creamos un objeto usuario con el email y la contraseña. Ya que el nombre es obligatorio rellenarlo, podemos pasar '' o null.
    const usuario = new Usuario(
      '',
      formulario.value.username,
      formulario.value.password
    );

    this.usuarioService.loginUsuario(usuario, formulario.value.recordar).subscribe(
      () => {
        Swal.close();
        this.router.navigateByUrl('/dashboard');
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: err.error.mensaje
        });
        console.log(err);
      }
    );
  }




  googleInit() {
    // Cargamos el objeto auth2 en gapi y al terminar se llama al callback
    gapi.load('auth2', () => {
      // Obtenemos nuestro objeto auth2 pasando algunas opciones
      this.auth2 = gapi.auth2.init({
        client_id: '575224325339-7qj9curlj2rv61kvl5iinhmmb2ipnrhr.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      // Le ponemos el clickHandler al boton de login
      this.attachSignin(this.btnGoogle);
    });
  }
  attachSignin(element: ElementRef) {

    this.auth2.attachClickHandler(
      element.nativeElement,
      // opciones
      {},
      // callback similar al onSignIn del ejemplo de login con google que hicimos dentro del backend
      googleUser => {
        /* const profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. */


        Swal.fire({
          allowOutsideClick: () => !Swal.isLoading(),
          type: 'warning',
          text: 'Espere por favor...',
          onBeforeOpen: () => Swal.showLoading()
        });

        // Obtenemos el token del usuario de google y realizamos nuestro login
        const token = googleUser.getAuthResponse().id_token;

        this.usuarioService.loginGoogle(token).subscribe(
          () => {
            Swal.close();
            // Puesto que estamos dentro del código de la libreria de google, externa a Angular, los métodos de clases de Angular deben
            // correrse usando la NgZone para que no salten warnings o errores.
            this.ngZone.run(() => this.router.navigateByUrl('/dashboard'));
          },
          err => {
            Swal.fire({
              type: 'error',
              title: 'Error',
              text: err.error.mensaje
            });
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }
}
