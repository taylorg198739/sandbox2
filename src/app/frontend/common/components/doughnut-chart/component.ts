import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import Chart from 'chart.js';
import { SharedService } from 'services/shared.service';
import 'chartjs-plugin-labels';

@Component({
    selector: 'app-doughnut-chart',
    templateUrl: './template.html',
    styleUrls: ['./component.scss'],
})
export class DoughnutChartComponent implements OnInit, AfterViewInit {
    isDarkMode = false;
    loaded;

    @ViewChild('doughnutChart', { static: false }) chartCanvas: ElementRef;
    @Input() bgcolor;
    @Input() chartColor;
    @Input() data;
    @Input()
    set title(strDate: string) {
        if (strDate) {
            this.title2 = strDate;
            // console.log(this.title2);
            // const a = 'Failures';
            // if (this.title2 === 'Failures') {
            //     this.addText('Failures');
            // } else if (this.title2 === 'Violations') {
            //     this.addText('Violations');
            // }

        }
    }
    @Input() labelPosition = 'right';
    @Input() cutoutPercentage = 85;
    @Input() set textMiddle(value: boolean) {
        this.showTextMiddle = value == null || value === undefined ? true : value;
        console.log(this.showTextMiddle)
    }
    @Input()
    set aspectRatio(value: boolean) {
        this.maintainAspectRatio = value == null || value === undefined ? true : value;
    }
    @Input() set showPercent(value: boolean) {
        this.showPercentage = value == null || value === undefined ? false : value;
    }
    title2;
    showPercentage;
    maintainAspectRatio = true;
    showTextMiddle;

    // constructor() {}
    constructor(private sharedService: SharedService) {
    }

    ngOnInit() {}

    ngOnChanges() {
      if (this.chartCanvas) {
        this.loadChart();
      }
    }

    loadChart() {
        const that = this;
        this.loaded = true;
        // tslint:disable-next-line: no-unused-expression
        const chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'doughnut',
            // tslint:disable-next-line: no-trailing-whitespace

            data: {
                labels: this.data.map(d => d.text),
                datasets: [
                    {
                        label: 'Population (millions)',
                        backgroundColor: this.chartColor,
                        data: this.data.map(d => d.value),
                        borderWidth: 2,
                        borderColor: this.isDarkMode ? this.bgcolor : '#fff',
                        hoverBorderColor: this.isDarkMode ? this.bgcolor : '#fff',
                    },
                ],
            },
            plugins: [{
                beforeDraw (event) {
                    console.log(event);
                    const ctx = chart.chart.ctx;
                    const centerConfig = chart.config.options.elements.center;
                    const fontStyle = centerConfig.fontStyle || 'Arial';
                    const txt = centerConfig.text;
                    const color = centerConfig.color || '#000';
                    const sidePadding = centerConfig.sidePadding || 20;
                    const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
                    // Start with a base font of 30px
                    ctx.font = '30px ' + fontStyle;

                    // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    const stringWidth = ctx.measureText(txt).width;
                    const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                    // Find out how much the font can grow in width.
                    const widthRatio = elementWidth / stringWidth;
                    const newFontSize = Math.floor(30 * widthRatio);
                    const elementHeight = (chart.innerRadius * 2);

                    // Pick a new font size so it will not be larger than the height of label.
                    const fontSizeToUse = Math.min(newFontSize, elementHeight);

                    // Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse + 'px ' + fontStyle;
                    ctx.fillStyle = color;
                    let value = 0;
                    that.data.forEach(element => {
                        value += element.item;
                    });
                    // const total = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    const total = Math.round(value);
                    // Draw text in center
                    if (that.showTextMiddle) {
                        ctx.fillText(total, centerX + 5, centerY);
                        ctx.font = '0.7rem ' + fontStyle;
                        ctx.fillText(`Total ${that.title2}`, centerX + 5, centerY + 20);
                    }
                },
            }],
            options: {
                legend: {
                    position: this.labelPosition,
                    align: 'end',
                    display: true,
                    labels: {
                        align: 'center',
                        fontColor: this.isDarkMode ? '#fff' : '#1d253b',
                        usePointStyle: true,
                        // fontFamily: "'Poppins', sans-serif'"
                    },
                },
                // maintainAspectRatio: false,
                maintainAspectRatio: that.maintainAspectRatio,

                cutoutPercentage: this.cutoutPercentage,
                rotation: 0,
                elements: {
                    center: {
                        color: this.isDarkMode ? '#fff' : '#1d253b',
                        sidePadding: 0, // Default 20 (as a percentage)
                    },
                },
                plugins: {
                    labels: {
                        render (args) {
                            return that.showPercentage ? args.value.toFixed(1) + '%' : '';
                        },
                        textMargin: 4,
                        arc: false,
                        position: 'outside',
                        fontColor: this.isDarkMode ? '#fff' : '#172f46',
                    }
                },
              tooltips: {
                callbacks: {
                  label (tooltipItem, data) {
                    let label = (data.labels[tooltipItem.index] ? data.labels[tooltipItem.index] : 'Unknown') + ': ';
                    if (that.showPercentage) {
                      label = label + that.convertUnit(that.data[tooltipItem.index].item, 0);
                    } else {
                      label = label + data.datasets[0].data[tooltipItem.index] + '%';
                    }
                    return label;
                  },
                  title (tooltipItems, data) {
                    //Return value for title
                    if (that.showPercentage) {
                      return ''
                    }
                    if (tooltipItems.length) {
                      return Math.round(that.data[tooltipItems[0].index].item)
                    } else {
                      return '';
                    }
                  },
                    },
                },
            },
        });

    }

    ngAfterViewInit() {
      const body = document.getElementsByTagName('body')[0];
      this.isDarkMode = !body.classList.contains('white-content');
      this.loadChart();
      // this.sharedService.mode.subscribe(mode => {
      //   this.loadChart();
      //       this.isDarkMode = mode;
      //       console.log('isDarkMode', this.isDarkMode);
      //       if (this.isDarkMode !== mode) {
      //       }
      //   });
      //   this.loadChart();
    }

    convertUnit(bytes, decimals = 1) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
