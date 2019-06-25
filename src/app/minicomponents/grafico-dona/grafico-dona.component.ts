import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { /*MultiDataSet, */Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  @Input() doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  @Input() doughnutChartData: number[] = [350, 450, 100];
  /* @Input() doughnutChartData: MultiDataSet = [
  [350, 450, 100],
    [50, 150, 120],
    [250, 130, 70],
  ]; */
  @Input() doughnutChartType: ChartType = 'doughnut';
  @Input() leyenda: string;

  constructor() { }

  ngOnInit() {
  }

}
