import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @Input() progreso: number;
  @Input('nombre') leyenda: string;
  @Output() cambioValor: EventEmitter<number> = new EventEmitter();
  // La opcion static sirve para decirle si queremos que recoja el valor despues de que se realicen posibles cambios en el html
  // por ejemplo si estamos accediendo a un elemento que tiene un ngIf y solo aparece en determinadas condiciones, queremos que el
  // static sea false para que tenga eso en cuenta. En este caso, solamente podremos acceder al elemento recogido desde ngAfterViewInit()
  // en adelante, ya que ngOnInit() es donde se resuelven los ngIf y ngFor. Si por el contrario nos interesa acceder desde ngOnInit() y
  // sabemos que el elemento no va a estar sujeto a posibles cambios (directivas ngIf, ngFor), podemos poner static: true.
  // En general y como forma de cubrirse las espaldas es recomendable poner static: false y solo utilizar static: true en las situaciones
  // concretas en que debamos acceder desde ngOnInit() y solo siempre que sea posible.
  @ViewChild('templateVariableProgreso', {static: false}) elementoProgreso: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  cambiarProgreso(valor: number) {
    this.progreso = this.progreso + valor;

    if (this.progreso > 100) {
      this.progreso = 100;
      return;
    }
    if (this.progreso < 0) {
      this.progreso = 0;
      return;
    }

    this.cambioValor.emit(this.progreso);
    // Seteamos el foco en el input asociado al boton clickado.
    this.elementoProgreso.nativeElement.focus();
  }

  onChanges(nuevoValor: number) {

    if (nuevoValor > 100) {
      nuevoValor = 100;
    }
    if (nuevoValor < 0) {
      nuevoValor = 0;
    }
    this.elementoProgreso.nativeElement.value = nuevoValor;
    this.cambioValor.emit(nuevoValor);
  }
}
