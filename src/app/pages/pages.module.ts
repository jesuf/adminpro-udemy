import { NgModule } from "@angular/core";

import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { PagesRoutingModule } from './pages-routing.routes';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { FormsModule } from "@angular/forms";
import { IncrementadorComponent } from '../minicomponents/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../minicomponents/grafico-dona/grafico-dona.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        IncrementadorComponent,
        GraficoDonaComponent
    ],
    imports: [
        SharedModule,
        PagesRoutingModule,
        FormsModule,
        ChartsModule
    ],
    exports: [
        /*DashboardComponent,
        ProgressComponent,
        Graficas1Component*/
    ],
    providers: []
})
export class PagesModule { }
