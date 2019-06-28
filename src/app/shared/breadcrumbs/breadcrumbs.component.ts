import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  titulo: string;

  constructor(private router: Router, private title: Title, private meta: Meta) {

    this.getDataFromRoute().subscribe(
      data => {
        this.titulo = data.titulo;
        this.title.setTitle(data.titulo);
        this.meta.addTag({
          name: 'description',
          content: data.descripcion
        });
      },
      () => {},
      () => {}
    );
  }

  ngOnInit() {
  }

  getDataFromRoute(): Observable<{[titulo: string]: string}> {
    return this.router.events.pipe(
      // filtramos que el evento sea del tipo que queremos ya que se reciben de mas tipos
      filter(evento => evento instanceof ActivationEnd),
      // filtramos que el evento no tenga hijos, es decir, ya que se reciben 2 eventos de tipo ActivationEnd,
      // tenemos que coger el que viene de pages-routing y no de app-routing.
      // app-routing manda a al pages-routing, que se encarga de mostrar PagesComponent y a su vez manda a la pagina hija
      // Este componente se carga en PagesComponent por lo que se carga 2 veces, de ahi que tengamos que separar la que nos interesa
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      // sacamos solo la propiedad data que es la que necesitamos para recoger el titulo
      map((evento: ActivationEnd) => evento.snapshot.data)
    );
  }
}
