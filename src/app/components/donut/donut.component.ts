import { Component, OnInit, Input } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styles: [
  ]
})
export class DonutComponent implements OnInit {

  @Input() title = 'Sin titulo';


  @Input('datos') dataset: number[] = [33, 33, 34]

  constructor() { }

  ngOnInit(): void {
    this.dataset = this.dataset;
    this.doughnutChartData.labels=this.doughnutChartLabels;
    this.doughnutChartData.datasets[0].data=this.dataset;
  }

  @Input('labels') doughnutChartLabels: string[] = ['Label 1', 'Label 2', 'Label 3'];
  
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: this.dataset,
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
        hoverBackgroundColor: ['#6351EA','#0096E1','#DA154B'], 
        hoverBorderColor:['#F6EDF0','#F6EDF0','#F6EDF0']
      }
    ]
  };

}
