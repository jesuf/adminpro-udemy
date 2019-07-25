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
    this.router.events.subscribe(evento => '');
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
      // filtramos que el evento no tenga hijos ya que al cargar la página entera se reciben 2 eventos de tipo ActivationEnd
      // (un evento de activacion de ruta para el componente PagesComponent que se carga en el router-outlet de app.component.html
      // y otro para el componente hijo DashboardComponent, ProgressComponent, etc que se carga en el router-outlet de pages.component.html)
      // Por tanto, tenemos que coger el del componente hijo, o sea, el que no tiene hijo.
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      // sacamos solo la propiedad data que es la que necesitamos para recoger el titulo
      map((evento: ActivationEnd) => evento.snapshot.data)
    );
  }
}
