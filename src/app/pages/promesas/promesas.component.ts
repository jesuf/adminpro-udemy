import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { reject } from 'q';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    // Si tenemos un onReject callback y mandamos un reject en la promesa, el error se manda al onReject callback.
    // Si no, se manda al catch. Además, en el catch tb podemos recoger un error mandado con reject en el resolve
    // puesto que en realidad el resolve es como otra promesa y además podríamos encadenar infinitos .then().
    this.contarHastaTres().then(
      () => /* reject('fallo en el resolve') */ console.log('La promesa termino'),
      (error) => console.log(error)
    ).catch(
      (error) => console.log(error)
    );
  }

  ngOnInit() {
  }

  contarHastaTres(): Promise<void> {
    return new Promise((resolve, reject) => {
      let contador = 0;
      const intervalo = setInterval(() => {
        contador++;
        if (contador === 3) {
          clearInterval(intervalo);
          resolve();
          // reject('fallo en la promesa');
        }
        console.log(contador);
      }, 1000);
    });
  }

}
