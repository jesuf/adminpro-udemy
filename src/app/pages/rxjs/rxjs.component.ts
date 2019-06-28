import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    // reintentaremos 2 veces si el observable tira un error
    // el error no se recoge en el subscribe hasta que se reintenta el numero de veces establecido
    // y solo si en esas veces el observable no ha conseguido superar la circunstancia que produce el error.
    const obsPipeado = this.regresaObservable().pipe(
      retry(2),
      // map se usa como un filtro pero de propiedades de lo que se manda
      // siempre va a mandar algo, si no establecemos nada, sera unknown
      // en este caso no tiene mucho sentido pero con objetos, podemos acceder a cualquier propiedad y enviar solo eso
      map(contador => contador.toLocaleString()),
      // filter es un filtro de valores, recibe el valor y su indice y lo manda o no segun retornemos true o false
      // por defecto es false
      filter((locale, index) => {
        if (index % 2 === 1) {
          return true;
        }
      })
    );

    this.subscription = obsPipeado.subscribe({
      next: contador => {
        console.log(contador);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log('completado obs1');
      }
    });
    /* setTimeout(() => {
      this.regresaObservable().subscribe({
        next: contador => {
          console.log(contador);
        },
        error: err => {

        },
        complete: () => {
          console.log('completado obs2');
        }
      });
    }, 3000); */
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  regresaObservable(): Observable<number> {
    return new Observable(observer => {
      let contador = 0;
      const interval = setInterval(() => {
        contador++;
        observer.next(contador);
        if (contador === 6) {
          observer.complete();
        }
        if (contador === 5) {
          // si no reestablecemos el intervalo, la primera vez que se haga retry,
          // el contador empezara desde 5 en lugar de 0 y pasara a 6 con lo que terminara correctamente
          // en cambio si reseteamos, siempre llegaremos aqui y al alcanzar el numero de veces que haremos retry (2)
          // se mandara el error a la subscripcion.
          // clearInterval(interval);
          observer.error('error!!');
        }
      }, 1000);
    });
  }


}
