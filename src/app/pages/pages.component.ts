import { Component, OnInit } from '@angular/core';

// Debemos declarar que existe una funcion llamada cargar_scripts previamente cargada en un archivo de javascript
// y que queremos usarla en typescript para lo cual debemos asignarle un tipo, any.
declare function cargar_scripts(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Llamamos a la función que inicializa los scripts que usa la plantilla
    // Esta función se encuentra en el arhivo custom.js e inicialmente se ejecutaba sola, pero cuando cargamos la página
    // en login o register, al no existir los elementos de sidebar, etc, estos no pueden inicializarse con su funcionalidad
    // y al navegar a una página como dashboard, no funcionan, de modo que inicializamos en pages, login y register y asunto arreglado.
    cargar_scripts();
  }

}
