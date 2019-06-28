import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';


const pagesRoutes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard', descripcion: 'Descripción de la página.'} },
            { path: 'progress', component: ProgressComponent, data: {titulo:'Barras de progreso',descripcion: 'Descripción de la página.'}},
            { path: 'graficas1', component: Graficas1Component, data: {titulo: 'Gráficos', descripcion: 'Descripción de la página.'} },
            { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas', descripcion: 'Descripción de la página.'} },
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs', descripcion: 'Descripción de la página.'} },
            { path: 'account', component: AccountSettingsComponent, data: {titulo: 'Ajustes', descripcion: 'Descripción de la página.'} },
            { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
        ]
    }
];

// export const PagesRoutingModule = RouterModule.forChild(pagesRoutes);

@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
