import { Injectable } from '@angular/core';
import { ServicesModule } from '../services.module';

@Injectable({
  providedIn: ServicesModule
})
export class SidebarService {

  menus: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenus: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'Barras de progreso', url: '/progress' },
        { titulo: 'Gráficos', url: '/graficas1' },
        { titulo: 'Promesas', url: '/promesas' },
        { titulo: 'RxJs', url: '/rxjs' },
      ]
    },
    {
      titulo: 'Mantenimiento',
      icono: 'mdi mdi-folder-lock-open',
      submenus: [
        { titulo: 'Usuarios', url: '/usuarios' },
        { titulo: 'Hospitales', url: '/hospitales' },
        { titulo: 'Médicos', url: '/medicos' }
      ]
    }
  ];

  constructor() { }
}
