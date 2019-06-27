import { Injectable, Renderer2 } from '@angular/core';
import { ServicesModule } from '../services.module';

@Injectable({
  providedIn: ServicesModule
})
export class SettingsService {

  public renderer: Renderer2;
  public document: any;

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    temaNombre: 'default'
  };


  constructor() {
    // cuando inyectamos el servicio en un componente, se llama a este constructor directamente,
    // siempre y cuando el servicio no estuviese instanciado ya. En futuras inyecciones, simplemente se reutiliza.
    // Si lo hacemos en app.component, además nos aseguramos de que el servicio se cree desde el principio de la aplicación,
    // ideal para cargar valores de ajustes o instanciar objetos.
  }

  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes() {
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      this.establecerTema();
    }
  }

  // este método hace dos cosas, por un lado recoge un nombre de tema y setea los valores en ajustes guardando en el localStorage
  // por otro lado establece el tema como tal
  establecerTema(nombreTema?: string) {

    if (nombreTema) {
      this.ajustes.temaNombre = nombreTema;
      this.ajustes.temaUrl = 'assets/css/colors/' + nombreTema + '.css';
      this.guardarAjustes();
    }

    // accedemos al elemento <script> en el index.html que establece la ruta del tema y lo cambiamos
    this.renderer.setAttribute(this.document.getElementById('theme'), 'href', this.ajustes.temaUrl);
  }
}

interface Ajustes {
  temaUrl: string;
  temaNombre: string;
}
