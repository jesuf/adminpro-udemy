import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { PagesRoutingModule } from './pages-routing.routes';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { FormsModule } from '@angular/forms';
import { IncrementadorComponent } from '../minicomponents/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../minicomponents/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent,
        AccountSettingsComponent,
        PromesasComponent,
        RxjsComponent
    ],
    imports: [
        SharedModule,
        PagesRoutingModule,
        FormsModule,
        ChartsModule
    ],
    exports: [
        // no es necesario exportar los components porque accedemos a ellos desde router-outlet en app.component y no
        // definiendo sus selectores directamente. En caso contrario, si por ejemplo quisieramos poner <app-pages></app-pages>
        // en el app.component, sería necesario exportar PagesComponent, y así sucesivamente.
    ],
    providers: []
})
export class PagesModule { }
