import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kd-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.scss'],
})
export class TopologyComponent implements OnInit {

  public data: any;

  constructor() { }

  ngOnInit() {
  }

  public generate(event: any) {
    this.data = event.data;
  }
}
