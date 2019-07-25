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
      map(contador => contador),
      // filter es un filtro de valores, recibe el valor y su indice y lo manda o no segun retornemos true o false
      // por defecto es false
      filter((locale, index) => {
        if (locale % 2 === 0) {
          return true;
        }
      })
    );

    this.subscription = obsPipeado.subscribe({
      next: contador => {
        console.log(contador + 'next');
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
      // El intervalo se ejecuta en un hilo separado, por lo que si el Observable trata de emitir un error pero tenemos aplicado
      // un operador retry(2), nos resuscribimos al Observable pero el intervalo de la suscripción anterior sigue ejecutándose.
      // El objeto observer, no obstante, es el mismo, puesto que los objetos en javascript se pasan por referencia. De esta forma,
      // cuando llegamos a un observer.complete en un intervalo, el Observable deja de emitir datos en todos los intervalos y además,
      // ya no podrá emitir errores tampoco. Ese comportamiento es interesante porque se puede ver como una carrera. Si el primer hilo
      // alcanza contador === 7 antes de que el tercer hilo (ya que reintentamos 2 veces) alcance contador === 3, no recibiremos error,
      // si no complete, y viceversa (sería al revés si por ejemplo aumentamos el valor para el complete de forma que tarde más).
      const interval = setInterval(() => {
        contador++;
        console.log(contador);
        observer.next(contador);
        if (contador === 7) {
          // Debemos limpiar siempre el intervalo cuando se completa el Observable para que no se quede el proceso colgando
          // y haya pérdidas de memoria.
          clearInterval(interval);
          observer.complete();
        }
        if (contador === 3) {
          // Al llegar aquí la primera vez, se intenta mandar el error, pero el retry(2) impide que esto se lleve a cabo,
          // en cambio, nos resuscribimos al Observable, de modo que se crea un nuevo hilo de ejecución que también llegará a este punto.
          // El hilo actual, por su parte, seguirá ejecutándose hasta que alcance el contador === 7 y termine, y así sucesivamente.

          // Si reestablecemos el intervalo antes de mandar el error, solo tendremos el proceso de la nueva suscripción corriendo,
          // que a su vez terminará al llegar aquí y así 2 veces hasta mandar el error definitivamente.
          // clearInterval(interval);

          observer.error('error!!');
        }
      }, 1000);
    });
  }
}

