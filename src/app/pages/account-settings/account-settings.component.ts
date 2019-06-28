import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { SettingsService } from '../../services/services.index';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements AfterViewInit {

  // Obtenemos una referencia de todos los enlaces mediante su variable de template
  @ViewChildren('enlaceTema') elementosEnlace: QueryList<ElementRef>;

  constructor( private settingsService: SettingsService ) { }

  ngAfterViewInit() {
    // recorremos todos los enlaces y llamamos a seleccionarElemento pasando el elemento cuyo color coincide con el que tiene el servicio
    this.elementosEnlace.forEach((elemRef) => {
      if (elemRef.nativeElement.getAttribute('data-theme') === this.settingsService.ajustes.temaNombre) {
        this.seleccionarElemento(elemRef.nativeElement);
        return;
      }
    });
  }

  establecerTema(nombreTema: string, evento: Event) {

    this.settingsService.establecerTema(nombreTema);

    // EventTarget es una interfaz de la que hereda Element por lo que podemos castear el tipo a Element
    this.seleccionarElemento(evento.target as Element);
  }


  seleccionarElemento(elemento: Element) {
    // recorremos todos los enlaces y les quitamos la clase working
    this.elementosEnlace.forEach((elemRef) => this.settingsService.renderer.removeClass(elemRef.nativeElement, 'working'));

    // ponemos la clase working al elemento clickado
    this.settingsService.renderer.addClass(elemento, 'working');

  }
}
