import { Component, Renderer2, Inject } from '@angular/core';
import { SettingsService } from './services/services.index';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Injectamos el objeto DOCUMENT (raiz del DOM) como si fuera un servicio para tener acceso a el, aunque esto no es una buena practica
  // por lo que se explica a continuacion, no existe otra forma CONOCIDA POR MI de acceder a elementos del head
  // Angular esta diseñado para abstraerse del renderizado del DOM y así poder reutilizar el codigo para
  // servidores, web workers y apps nativas (ReactNative, NativeScript).
  // Por ello debemos usar Renderer2, que esta preparada para manipular propiedades de objetos del DOM de forma segura
  constructor(@Inject(DOCUMENT) private document, private renderer: Renderer2, private settingsService: SettingsService) {
    this.settingsService.renderer = this.renderer;
    this.settingsService.document = this.document;
    this.settingsService.cargarAjustes();
  }
}
