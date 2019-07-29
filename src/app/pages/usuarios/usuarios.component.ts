import { Component, OnInit, NgZone } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  registros: number;
  usuarios: Usuario[];

  desde: number = 0;
  limite: number;
  loading: boolean;
  error: any;
  mostrandoTodos: boolean;

  constructor(private usuarioService: UsuarioService, private ngZone: NgZone) { }

  ngOnInit() {
    this.cargarUsuarios();
    $('#myModal').on('hide.bs.modal', evento => {
      // tenemos que correr esto en la zona de angular para que los datos se actualicen al instante
      this.ngZone.run(() => {
        this.cargarUsuarios();
      });
    });
  }


  cargarUsuarios() {
    this.mostrandoTodos = true;
    this.error = null;
    this.loading = true;
    this.usuarioService.obtenerUsuarios(this.desde).subscribe(
      (resp: any) => {
        this.registros = resp.total;
        this.usuarios = resp.usuarios;

        if (this.desde + 5 < this.registros) {
          this.limite = this.desde + 5;
        } else {
          this.limite = this.registros;
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.registros || desde < 0) {
      return;
    }

    if (this.desde + 5 < this.registros) {
      this.limite = this.desde + 5;
    } else {
      this.limite = this.registros;
    }

    this.desde = desde;
    this.cargarUsuarios();
  }

  buscarUsuarios(termino: string) {
    this.mostrandoTodos = false;
    this.error = false;
    this.loading = true;
    this.usuarioService.buscarUsuarios(termino).subscribe(
      (resp: any) => {
        this.registros = resp.total;
        this.usuarios = resp.usuarios;
        this.limite = this.registros;
        this.loading = false;
      },
      err => {
        console.log(err);
        this.error = err;
        this.loading = false;
      }
    );
  }

  guardarUsuario(usuario: Usuario) {
    this.usuarioService.actualizarDatosUsuario(usuario).subscribe(
      () => {
        Swal.fire({
          type: 'success',
          title: 'Usuario ' + usuario.nombre + ' actualizado.'
        });
      },
      err => {
        Swal.fire({
          type: 'error',
          title: err.error.status + ': ' + err.error.statusText,
          text: err.error.mensaje
        });
      }
    );
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire('Acción no permitida', 'No se puede borrar a sí mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Eliminar a ' + usuario.nombre + '?',
      text: 'Esta acción es irreversible',
      type: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger mr-1',
        cancelButton: 'btn btn-secondary mr-1'
      },
      buttonsStyling: false
    }).then((result) => {
      // console.log(result);
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario._id).subscribe(
          (resp: any) => {

            /* this.usuarios = this.usuarios.filter(item => item !== usuario);
            this.registros --; */
            this.cargarUsuarios();

            Swal.fire({
              type: 'success',
              title: 'Usuario ' + usuario.nombre + ' eliminado.'
            });
          },
          err => {
            Swal.fire({
              type: 'error',
              title: err.error.status + ': ' + err.error.statusText,
              text: err.error.mensaje
            });
          }
        );
      }
    });
  }
}
