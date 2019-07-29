import { Component, OnInit } from '@angular/core';

// Debemos declarar que existe una funcion llamada cargar_scripts previamente cargada en un archivo de javascript
// y que queremos usarla en typescript para lo cual debemos asignarle un tipo, any.
declare function cargar_scripts(): any;

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: []
})
export class NopagefoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    cargar_scripts();
  }

}
