import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  imagen: File;
  imagenTemp: string;
  loadingDatos: boolean;
  loadingImagen: boolean;

  constructor(public usuarioService: UsuarioService) { }

  ngOnInit() {
  }

  guardarDatos(formulario: NgForm) {

    this.loadingDatos = true;

    // aunque no tenemos el campo password, que es obligatorio para crear un objeto Usuario,
    // Angular no sabe lo que estamos mandando a esta funcion y confia en nosotros. Más adelante, en la definicion del método
    // el hecho de que falte el password en el objeto usuario recibido no es relevante ya que no la utilizamos para nada.
    // Simplemente lo enviamos al servicio PUT, el cual no la requiere.
    this.usuarioService.actualizarDatosUsuario(formulario.value).subscribe(
      () => {
        Swal.fire({
          type: 'success',
          title: 'Datos actualizados'
        });
        this.loadingDatos = false;
      },
      err => {
        Swal.fire({
          type: 'error',
          title: err.status + ' - ' + err.statusText,
          text: err.error.mensaje
        });
        this.loadingDatos = false;
      }
    );
  }

  imagenSeleccionada(archivo: File) {
    if (!archivo) {
      this.imagen = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire({
        type: 'error',
        title: 'El archivo debe ser una imagen'
      });
    }

    this.imagen = archivo;

    // con este codigo, convertimos el archivo en una string en Base64 interpretable como URL de forma asíncrona,
    // de modo que cuando termina de cargar, es cuando recogemos el resultado y lo asignamos a nuestra ruta de imagen temporal
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result as string;
  }

  guardarImagen() {

    this.loadingImagen = true;

    this.usuarioService.actualizarImagenUsuario(this.imagen).subscribe(
      () => {},
      err => {
        Swal.fire({
          type: 'error',
          title: err.status + ' - ' + err.statusText,
          text: err.error.mensaje
        });
        this.loadingImagen = false;
      },
      () => {
        Swal.fire({
          type: 'success',
          title: 'Imagen actualizada'
        });
        this.loadingImagen = false;
      }
    );
  }
}
