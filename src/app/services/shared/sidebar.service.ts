import { Injectable } from '@angular/core';
import { ServicesModule } from '../services.module';

@Injectable({
  providedIn: ServicesModule
})
export class SidebarService {

  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Barras de progreso', url: '/progress' },
        { titulo: 'Gráficos', url: '/graficas1' },
        { titulo: 'Promesas', url: '/promesas' },
        { titulo: 'RxJs', url: '/rxjs' },
      ]
    }
  ];

  constructor() { }
}
