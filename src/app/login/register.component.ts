import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControlOptions } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/services.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

// Debemos declarar que existe una funcion llamada cargar_scripts previamente cargada en un archivo de javascript
// y que queremos usarla en typescript para lo cual debemos asignarle un tipo, any.
declare function cargar_scripts(): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login_register.component.css']
})
export class RegisterComponent implements OnInit {

  formulario: FormGroup;

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
    // Llamamos a la función que inicializa los scripts que usa la plantilla
    // Esta función se encuentra en el arhivo custom.js e inicialmente se ejecutaba sola, pero cuando cargamos la página
    // en login o register, al no existir los elementos de sidebar, etc, estos no pueden inicializarse con su funcionalidad
    // y al navegar a una página como dashboard, no funcionan, de modo que inicializamos en pages, login y register y asunto arreglado.
    cargar_scripts();

    this.formulario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      password_repeat: new FormControl(''),
      condiciones: new FormControl(false, Validators.required)
    }, this.noIguales);

    this.formulario.setValue({
      nombre: 'Jesu',
      correo: 'jmv@okuzo.com',
      password: '123456',
      password_repeat: '123456',
      condiciones: true
    });
  }

  registrarUsuario() {
    if (this.formulario.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: () => !Swal.isLoading(),
      type: 'warning',
      text: 'Espere por favor...',
      onBeforeOpen: () => Swal.showLoading()
    });

    const usuario = new Usuario(
      this.formulario.value.nombre,
      this.formulario.value.correo,
      this.formulario.value.password
    );

    this.usuarioService.crearUsuario(usuario).subscribe(
      resp => {
        Swal.fire({
          type: 'success',
          title: 'Usuario creado',
          text: usuario.email
        });
        this.router.navigateByUrl('/login');
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

  noIguales(formulario: FormGroup): AbstractControlOptions {

    if (formulario.controls.password.value !== formulario.controls.password_repeat.value) {
      return { passdistintas: true } as AbstractControlOptions;
    }
    return null;
  }
}
