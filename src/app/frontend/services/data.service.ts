import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class DataService extends BaseService {

  constructor(http: HttpClient) {
    super(http);
  }

  getCount(type) {
    return this.get(`query?query=count(endpoint_state${type})`);
  }

  getGraphCount(type, start, end, step) {
    return this.get(`query_range?query=count(endpoint_state${type})&start=${start}&end=${end}&step=${step}`);
  }

  getIncreaseOrDecrease(type, interval) {
    return this.get(`query?query=(count(endpoint_state${type})%2Dcount(endpoint_state${type} offset ${interval}))%2Fcount(endpoint_state${type} offset ${interval})`);
  }

  getThroughputGraph(type, start, end, step) {
    return this.get(`query_range?query=sum(rate(endpoint_rx_bytes${type}%5B5m%5D)%2Brate(endpoint_tx_bytes${type}%5B5m%5D))&start=${start}&end=${end}&step=${step}`)
  }

  getTotalThroughputGraph(time, type) {
    return this.get(`query?query=sum(increase(endpoint_rx_bytes${type}[${time}])%2Bincrease(endpoint_tx_bytes${type}[${time}]))`)
  }

  getDownloadThroughputGraph(time, type) {
    return this.get(`query?query=sum(increase(endpoint_rx_bytes${type}[${time}]))`)
  }

  getUploadThroughputGraph(time, type) {
    return this.get(`query?query=sum(increase(endpoint_tx_bytes${type}[${time}]))`)
  }

  getEndPointChart(time, name) {
    return this.get(`query?query=sum(increase(endpoint_rx_bytes[${time}])%2Bincrease(endpoint_tx_bytes[${time}]))by(${name})`)
  }

  getEndPointTable(type, time, name) {
    return this.get(`query?query=sum(increase(endpoint_rx_bytes${type}[${time}])%2Bincrease(endpoint_tx_bytes${type}[${time}]))by(${name})`)
  }

  getFailureViolation(time, name) {
    return this.get(`query?query=increase(endpoint_${name}[${time}])`);
  }

  getAvgTime(time) {
    return this.get(`query?query=avg_over_time(endpoint_conn_time[${time}])`);

  }

}
