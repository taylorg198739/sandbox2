import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges } from '@angular/core';
import Chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-line-chart',
  templateUrl: './template.html',
  styleUrls: ['./component.scss'],
})
export class LineChartComponent implements OnInit, AfterViewInit, OnChanges {
  public canvas: any;
  public ctx;
  public datasets: any;

  @Input() color: string;
  @Input() data;
  @Input() showLabel;
  @Input() shadowPercent;
  @Input() max;
  @Input() min = 0;
  @Input() stepSize = 60000;
  @Input() showMonthDate;

  @ViewChild('chartne', {static: false}) chartCanvas: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.chartCanvas) {
      this.loadChart();
    }
  }

  loadChart() {
    const that = this;
    const gradientChartOptionsConfigurationWithTooltipBlue: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
        callbacks: {
          label (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label = moment.unix(data.labels[tooltipItem.index]).format('MMMM DD, YYYY HH:mm:ss A');
            return label;
          },
          title (tooltipItems, data) {
            //Return value for title
            if (tooltipItems.length) {
              return that.convertUnit(tooltipItems[0].yLabel) ? that.convertUnit(tooltipItems[0].yLabel) : tooltipItems[0].yLabel;
            } else {
              return '';
            }
          },
        }
      },
      responsive: true,
      scales: {
        yAxes: [{
          display: this.showLabel,
          barPercentage: 1.2,
          gridLines: {
            drawBorder: false,
            color: 'rgba(156, 174, 191, 0.5)',
            zeroLineColor: 'transparent',
          },
          ticks: {
            suggestedMin: this.min,
            suggestedMax: this.max,
            stepSize: this.max / 4,
            padding: 20,
            fontColor: '#9caebf',
            callback (value, index, values) {
              return that.convertUnit(value) + '/s';
            }
          }
        }],

        xAxes: [
          {
            display: this.showLabel,
            barPercentage: 1.6,
            gridLines: {
              display: false,
              drawBorder: false,
              color: '#9caebf',
              zeroLineColor: 'transparent',
            },
            ticks: {
              padding: 20,
              stepSize: 9000000000,
              fontColor: '#9caebf',
              callback (value, index, values) {
                return that.showMonthDate ? moment.unix(value).format('MMM DD, HH:mm A') : moment.unix(value).format('HH:mm A');
              }
            }
          }
        ]
      }
    };
    this.canvas = this.chartCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');


    const gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, `rgba(${this.color},0.1)`);
    gradientStroke.addColorStop(this.shadowPercent ? this.shadowPercent : 0.7, `rgba(${this.color},0.5)`); //green colors
    gradientStroke.addColorStop(0, 'rgba(0,0,0,0)'); //green colors

    const data = {
      labels: this.data.map(d => d.text),// x-axis
      datasets: [{
        label: '',
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: `rgba(${this.color},1)`,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: `rgba(${this.color},1)`,
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: `rgba(${this.color},1)`,
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 0,
        // data: [90, 27, 60, 12, 80],
        data: this.data.map(d => d.value),//y-axis

      }]
    };

    const myChart = new Chart(this.ctx, {
      type: 'line',
      data,
      options: gradientChartOptionsConfigurationWithTooltipBlue
    });
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  convertUnit(value) {
    if (value > 1000) {
      return Math.round(value / 1000) + 'KB';
    } else if (value > 1000000) {
      return Math.round(value / 1000000) + 'MB';
    } else if (value > 1000000000) {
      return Math.round(value / 1000000000) + 'GB';
    }
  }
}

