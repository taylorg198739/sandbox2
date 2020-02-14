import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import * as moment from 'moment';
import { SharedService } from '../services/shared.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'kd-dashboard',
    templateUrl: 'template.html',
    styleUrls: ['./style.scss',
      '../common/components/navbar/navbar.component.scss',
    ],
})

export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DataService, private sharedService: SharedService) {
    this.tabName = 'appName';
    this.getDataCount();
    this.loadData();
  }

  // navbar.classList.add('navbar-transparent');
  public canvas: any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked = true;
  public clicked1 = false;
  public clicked2 = false;
  throughputTab = 'wired';
  min;
  isDarkMode = false;
  tabName = 'appName';
  stepSize;
  lanIcon = '/assets/img/lan-icon.png';
  wifiIcon = '/assets/img/wifi-icon.png';

  public canvasWidth = 230;
  public needleValue = 65;
  public needleValue2 = 50;
  public options = {
    hasNeedle: true,
    needleColor: '#646464',
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    arcDelimiters: [30],
    rangeLabel: ['0', '25'],
    needleStartValue: 0,
  };
  public options2 = {
    hasNeedle: true,
    needleColor: '#646464',
    arcColors: ['#0fd671', 'lightgray'],
    arcDelimiters: [50],
    rangeLabel: ['0', '25'],
    needleStartValue: 0,
  };

  dataJson = {
    total: {
      count: 0,
      countWired: 0,
      countWifi: 0,
      increaseOrDecrease: 0,
      chart: [],
      isNegative: false,
    },
    registered: {
      count: 0,
      increaseOrDecrease: 0,
      chart: [],
      isNegative: false,
    },
    BYOD: {
      count: 0,
      increaseOrDecrease: 0,
      chart: [],
      isNegative: false
    },
    guest: {
      count: 0,
      increaseOrDecrease: 0,
      chart: [],
      isNegative: false
    },
    IOT: {
      count: 0,
      increaseOrDecrease: 0,
      chart: [],
      isNegative: false
    },
    throughput: {
      up: '',
      down: '',
      total: '',
      chart: []
    },
    endpoint: {
      backgroundColor: ['#47a1f9', '#f07e56', '#32a84e', '#ebc508', '#52e3d2'],
      table: [],
      chart: []
    },
    failure: {
      backgroundColor: ['#47a1f9', '#ebc508', '#f07e56', '#32a84e', '#52e3d2'],
      chart: []
    },
    violation: {
      backgroundColor: ['#32a84e', '#ebc508', '#47a1f9', '#f07e56', '#52e3d2'],
      chart: []
    },
    avgTime: {
      wired: 0,
      wifi: 0,
      wifiNeedleValue: 0,
      wiredNeedleValue: 0
    }
  };

  intervals = [
    {
      name: '1 hour',
      step: '120',
      time: '60m',
      value: '1h',
      number: 1,
      str: 'h',
      stepSize: 60000
    },
    {
      name: '6 hours',
      step: '5m',
      time: '5m',
      value: '6h',
      number: 2,
      str: 'h',
      stepSize: 300000
    },
    {
      name: '1 day',
      step: '15m',
      time: '15m',
      value: '1d',
      number: 1,
      str: 'd',
      stepSize: 90000000
    },
    {
      name: '2 days',
      step: '30m',
      time: '30m',
      value: '2d',
      number: 2,
      str: 'd',
      stepSize: 1800000
    },
    {
      name: '7 days',
      step: '1h',
      time: '15m',
      value: '7d',
      number: 7,
      str: 'd',
      stepSize: 3600000
    }
  ];
  interval: any = this.intervals[0];
  end = moment().unix();
  start = moment().subtract(1, 'h').unix();
  gaugeChartOption = {
    arcDelimiters: [30],
  }

  download = 0;
  upload = 0;
  total = 0;
  showMonthDate = false;
  connectivityType = '';

  updateColor = () => {
    const navbar = document.getElementsByClassName('navbar')[0];
    navbar && navbar.classList.add('bg-white');
    navbar && navbar.classList.remove('navbar-transparent');
  }

  loadData() {
    this.getDataTotal();
    this.getDataRegistered();
    this.getDataBYOD();
    this.getDataGuest();
    this.getDataIOT();
    this.getThroughputGraph();
    this.getEndPoint();
    this.getFailureViolation();
    this.getAvgTime();
    this.getEndPoint();
  }

  ngOnInit() {
    this.tabName = 'appName';
    window.addEventListener('resize', this.updateColor);
    const body = document.getElementsByTagName('body')[0];
    this.isDarkMode = !body.classList.contains('white-content');
    // this.sharedService.mode.subscribe(mode => {
    //   this.isDarkMode = mode;
    // });
  }

  getDataCount() {
    this.dashboardService.getCount('{connectivityType!="wireless"}').subscribe((res: any) => {
      this.dataJson.total.countWifi = res && res.status === 'success' ? Math.round(parseFloat(res.data.result[0].value[1])) : 0;
    });
    this.dashboardService.getCount('{connectivityType="wireless"}').subscribe((res: any) => {
      this.dataJson.total.countWired = res && res.status === 'success' ? Math.round(parseFloat(res.data.result[0].value[1])) : 0;
    });
    this.dashboardService.getCount('').subscribe((res: any) => {
      this.dataJson.total.count = res && res.status === 'success' ? Math.round(parseFloat(res.data.result[0].value[1])) : 0;
    });
    this.dashboardService.getCount('{registered="true"}').subscribe(res => {
      this.dataJson.registered.count = res && res.status === 'success' ? Math.round(parseFloat(res.data.result[0].value[1])) : 0;
    });
    this.dashboardService.getCount('{deviceAuthType="BYOD"}').subscribe(res => {
      this.dataJson.BYOD.count = res && res.status === 'success' ? Math.round(parseFloat(res.data.result[0].value[1])) : 0;
    });
    this.dashboardService.getCount('{networkType="guest"}').subscribe(res => {
      this.dataJson.guest.count = res && res.status === 'success' ? Math.round(parseFloat(res.data.result[0].value[1])) : 0;
    });
    this.dashboardService.getCount('{deviceCategory="IOT"}').subscribe(res => {
      this.dataJson.IOT.count = res && res.status === 'success' ? Math.round(parseFloat(res.data.result[0].value[1])) : 0;
    });
  }

  onSelectRange(item) {
    this.interval = item;
    if (this.interval.value === '2d' || this.interval.value === '7d') {
      this.showMonthDate = true;
    } else {
      this.showMonthDate = false;
    }
    this.end = moment().unix();
    this.start = moment().subtract(item.number, item.str).unix();
    this.stepSize = this.interval.stepSize;
    this.loadData();
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }

  getDataTotal() {
    const type = '';
    this.dashboardService.getIncreaseOrDecrease(type, this.interval.value).subscribe(res => {
      const value = this.getSuccessCount(res);
      if (value < 0) {
        this.dataJson.total.increaseOrDecrease = value * -1;
        this.dataJson.total.isNegative = true;
      } else {
        this.dataJson.total.increaseOrDecrease = value;
      }
      // this.dataJson.total.increaseOrDecrease = this.getSuccessCount(res);
    });
    this.dashboardService.getGraphCount(type, this.start, this.end, this.interval.step).subscribe(res => {
      this.dataJson.total.chart = this.getChart(res);
    });
  }

  getDataBYOD() {
    const type = '{deviceAuthType="BYOD"}';
    this.dashboardService.getIncreaseOrDecrease(type, this.interval.value).subscribe(res => {
      const value = this.getSuccessCount(res);
      if (value < 0) {
        this.dataJson.BYOD.increaseOrDecrease = value * -1;
        this.dataJson.BYOD.isNegative = true;
      } else {
        this.dataJson.BYOD.increaseOrDecrease = value;
      }
      // this.dataJson.BYOD.increaseOrDecrease = this.getSuccessCount(res);

    });

    this.dashboardService.getGraphCount(type, this.start, this.end, this.interval.step).subscribe(res => {
      this.dataJson.BYOD.chart = this.getChart(res);
    });
  }

  getDataGuest() {
    const type = '{networkType="guest"}';
    this.dashboardService.getIncreaseOrDecrease(type, this.interval.value).subscribe(res => {
      const value = this.getSuccessCount(res);
      if (value < 0) {
        this.dataJson.guest.increaseOrDecrease = value * -1;
        this.dataJson.guest.isNegative = true;
      } else {
        this.dataJson.guest.increaseOrDecrease = value;
      }
      // this.dataJson.guest.increaseOrDecrease = this.getSuccessCount(res);
    });
    this.dashboardService.getGraphCount(type, this.start, this.end, this.interval.step).subscribe(res => {
      this.dataJson.guest.chart = this.getChart(res);
    });
  }

  getDataRegistered() {
    const type = '{registered="true"}';
    this.dashboardService.getIncreaseOrDecrease(type, this.interval.value).subscribe(res => {
      const value = this.getSuccessCount(res);
      if (value < 0) {
        this.dataJson.registered.increaseOrDecrease = value * -1;
        this.dataJson.registered.isNegative = true;
      } else {
        this.dataJson.registered.increaseOrDecrease = value;
      }
    });
    this.dashboardService.getGraphCount(type, this.start, this.end, this.interval.step).subscribe(res => {
      this.dataJson.registered.chart = this.getChart(res);
    });
  }

  getDataIOT() {
    const type = '{deviceCategory="IOT"}';
    this.dashboardService.getIncreaseOrDecrease(type, this.interval.value).subscribe(res => {
      const value = this.getSuccessCount(res);
      if (value < 0) {
        this.dataJson.IOT.increaseOrDecrease = value * -1;
        this.dataJson.IOT.isNegative = true;
      } else {
        this.dataJson.IOT.increaseOrDecrease = value;
      }
      // this.dataJson.IOT.increaseOrDecrease = this.getSuccessCount(res);
    });
    this.dashboardService.getGraphCount(type, this.start, this.end, this.interval.step).subscribe(res => {
      this.dataJson.IOT.chart = this.getChart(res);
    });
  }

  getSuccessCount(res) {
    if (res && res.status === 'success' && res.data.result[0]) {
      return Math.round(parseFloat(res.data.result[0].value[1]) * 100);
    }
    return 0;
  }

  getThroughputGraph() {
    if (this.throughputTab === 'wired') {
      this.connectivityType = '{connectivityType!="wireless"}';
    } else if (this.throughputTab === 'wifi') {
      this.connectivityType = '{connectivityType="wireless"}';
    } else {
      this.connectivityType = '';
    }
    this.getTotalThroughputGraph();
    this.getDownloadThroughputGraph();
    this.getUploadThroughputGraph();
    this.end = moment().unix();
    this.start = moment().subtract(this.interval.number, this.interval.str).unix();

    this.dashboardService.getThroughputGraph(this.connectivityType, this.start, this.end, this.interval.step).subscribe(res => {
      this.dataJson.throughput.chart = this.getThroughputChart(res);
    })
  }

  getEndPoint() {
    this.dashboardService.getEndPointChart(this.interval.value, this.getTabName()).subscribe(res => {
      this.dataJson.endpoint.chart = this.getEndpointChart(res);
      this.getEndpointTable(res);
    })
  }

  getFailureViolation() {
    this.dashboardService.getFailureViolation(this.interval.value, 'failures').subscribe(res => {
      this.dataJson.failure.chart = this.getFailureViolationChart(res);
    })

    this.dashboardService.getFailureViolation(this.interval.value, 'violations').subscribe(res => {
      this.dataJson.violation.chart = this.getFailureViolationChart(res);
    })
  }

  getAvgTime() {
    this.dashboardService.getAvgTime(this.interval.value).subscribe(res => {
      this.dataJson.avgTime.wired = parseInt(res.data.result[0].value[1]);
      this.dataJson.avgTime.wifi = parseInt(res.data.result[1].value[1]);
      this.getDataCount();
      this.dataJson.avgTime.wifiNeedleValue = Math.floor((this.dataJson.avgTime.wifi / 25) * 100),
      this.dataJson.avgTime.wiredNeedleValue = Math.floor((this.dataJson.avgTime.wired / 25) * 100),
      this.options.arcDelimiters = [this.dataJson.avgTime.wifiNeedleValue];
      this.options2.arcDelimiters = [this.dataJson.avgTime.wiredNeedleValue];
    })
  }

  getFailureViolationChart(res) {
    let values;
    let total = 0;
    if (res.data && res.data.result) {
      res.data.result.map(item => {
        total += parseFloat(item['value'][1]);
      })
      total = parseInt(total.toString());
      values = res.data.result.map(result => {
        return { text: result.metric['reason'], value: Math.round(((parseFloat(result.value[1]) / total) * 100) * 10) / 10, item: parseFloat(result.value[1]) };
      })
      return values;
    }
    return [];
  }

  getEndpointChart(res) {
    let values;
    let total = 0;
    if (res.data && res.data.result) {
      res.data.result.map(item => {
        total += parseFloat(item['value'][1]);
      })
      values = res.data.result.map(result => {
        return { text: result.metric[this.getTabName()], value: Math.round(((parseFloat(result.value[1]) / total) * 100) * 10) / 10, item: parseFloat(result.value[1]) };
      })
      return values;
    }
    return [];
  }

  getTabName(){
    if (!this.tabName) {
      return 'appName';
    } else {
      return this.tabName;
    }
  }

  getEndpointTable(res) {
    forkJoin(
      {
        total: this.dashboardService.getEndPointTable('', this.interval.value, this.getTabName()),
        wifi: this.dashboardService.getEndPointTable('{connectivityType="wireless"}', this.interval.value, this.getTabName()),
        wired: this.dashboardService.getEndPointTable('{connectivityType!="wireless"}', this.interval.value, this.getTabName()),
        registered: this.dashboardService.getEndPointTable('{registered="true"}', this.interval.value, this.getTabName()),
        boyd: this.dashboardService.getEndPointTable('{deviceAuthType="BYOD"}', this.interval.value, this.getTabName()),
        guest: this.dashboardService.getEndPointTable('{networkType="guest"}', this.interval.value, this.getTabName()),
        iot: this.dashboardService.getEndPointTable('{deviceCategory="IOT"}', this.interval.value, this.getTabName()),
      }
    ).subscribe(res => {
      this.dataJson.endpoint.table = res.total.data.result.map(item => {
        const wifi = res.wifi.data.result.find(wifi => item.metric[this.getTabName()] === wifi.metric[this.getTabName()]);
        const wired = res.wired.data.result.find(wired => item.metrigetTotalThroughputGraphc[this.getTabName()] === wired.metric[this.getTabName()]);
        const registered = res.registered.data.result.find(registered => item.metric[this.getTabName()] === registered.metric[this.getTabName()]);
        const boyd = res.boyd.data.result.find(boyd => item.metric[this.getTabName()] === boyd.metric[this.getTabName()]);
        const guest = res.guest.data.result.find(guest => item.metric[this.getTabName()] === guest.metric[this.getTabName()]);
        const iot = res.iot.data.result.find(iot => item.metric[this.getTabName()] === iot.metric[this.getTabName()]);

        return {
          name: item.metric[this.getTabName()] ? item.metric[this.getTabName()] : 'Unknown',
          total: this.convertUnit(item.value[1], 0),
          wifi: wifi ? this.convertUnit(wifi.value[1], 0) : '',
          wired: wired ? this.convertUnit(wired.value[1], 0) : '',
          registered: registered ? this.convertUnit(registered.value[1], 0) : '',
          boyd: boyd ? this.convertUnit(boyd.value[1], 0) : '',
          guest: guest ? this.convertUnit(guest.value[1], 0) : '',
          iot: iot ? this.convertUnit(iot.value[1], 0) : ''
        }
      }).sort((a, b) => b.total.localeCompare(a.total))
      // this.dataJson.endpoint.table.sort((a, b) => a.total.localeCompare(b.total))
    })
  }

  getChart(res) {
    if (res.data && res.data.result) {
      // let min = res.data.result[0].values.reduce((prev, current) => (prev[1] < current[1]) ? prev : current);
      // this.min = Math.round(parseInt(min[1]) / 50000) * 50000;
      const values = res.data.result[0].values.map(item => {
        return { text: item[0], value: parseInt(item[1]), usage: parseInt(item[1]) };
      });
      return values;
    }
  }

  getThroughputChart(res) {
    if (res.data && res.data.result) {
      const min = res.data.result[0].values.reduce((prev, current) => (prev[1] < current[1]) ? prev : current);
      this.min = Math.round(parseInt(min[1]) / 50) * 50;
      const values = res.data.result[0].values.map(item => {
        return { text: item[0], value: Math.round(parseInt(item[1])), usage: parseInt(item[1]) };
      });
      return values;
    }
  }

  getTotalThroughputGraph() {
    this.dashboardService.getTotalThroughputGraph(this.interval.value, this.connectivityType).subscribe(res => {
      if (res && res.data) {
        this.dataJson.throughput.total = this.convertUnit(parseFloat(res.data.result[0].value[1]));
      }
    })
  }

  getDownloadThroughputGraph() {
    this.dashboardService.getDownloadThroughputGraph(this.interval.value, this.connectivityType).subscribe(res => {
      if (res && res.data) {
        this.dataJson.throughput.down = this.convertUnit(parseFloat(res.data.result[0].value[1]));
      }
    })
  }

  getUploadThroughputGraph() {
    this.dashboardService.getUploadThroughputGraph(this.interval.value, this.connectivityType).subscribe(res => {
      if (res && res.data) {
        this.dataJson.throughput.up = this.convertUnit(parseFloat(res.data.result[0].value[1]));
      }
    })
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
