import { Component, OnInit, NgZone } from '@angular/core';
import Swal from 'sweetalert2';
import { UploadService } from '../../services/upload/upload.service';

declare var $: any;

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagen: File;
  imagenTemp: string;
  loadingImagen: boolean;

  imagenRuta: string;
  coleccion: string;
  identificador: string;


  constructor(private uploadService: UploadService, private ngZone: NgZone) { }

  ngOnInit() {
    $('#myModal').on('show.bs.modal', evento => {
      const button = $(evento.relatedTarget); // Button that triggered the modal
      // tenemos que correr esto en la zona de angular para que los datos se actualicen al instante
      this.ngZone.run(() => {
        this.imagenTemp = null;
        this.imagenRuta = button.data('imagen'); // Extract info from data-* attributes
        this.identificador = button.data('identificador'); // Extract info from data-* attributes
        this.coleccion = button.data('coleccion');
      });
    });
  }

  /* ngAfterViewInit() {
    console.log(this.modal.nativeElement);
    this.renderer.listen(this.modal.nativeElement, 'show.bs.modal', (event) => {
      console.log('blabla');
      const button = event.relatedTarget; // Button that triggered the modal
      this.imagenRuta = button.data('imagen'); // Extract info from data-* attributes
      this.identificador = button.data('identificador'); // Extract info from data-* attributes
    });
  }*/

  guardarImagen() {

    this.loadingImagen = true;

    this.uploadService.subirArchivo(this.imagen, this.coleccion, this.identificador).subscribe(
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

  imagenSeleccionada(evento: Event) {

    const archivo = (evento.target as HTMLInputElement).files[0];

    // reseteamos el valor del input para que aunque mas tarde volvamos a seleccionar el mismo archivo, se vuelva a disparar el evento
    // si no, entiende que la ruta del archivo no ha variado y no lo dispara
    (evento.target as HTMLInputElement).value = null;

    console.log('seleccionarimagen');
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
    console.log('pasa los errores');

    this.imagen = archivo;

    // con este codigo, convertimos el archivo en una string en Base64 interpretable como URL de forma asíncrona,
    // de modo que cuando termina de cargar, es cuando recogemos el resultado y lo asignamos a nuestra ruta de imagen temporal
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result as string;
  }
}
