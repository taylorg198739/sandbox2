import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  Injectable
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Canvas } from '../../../canvas/canvas';
import { MatTooltip } from '@angular/material';
import { Router } from '@angular/router';
import { DataService } from '../../../services/data.service'

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})

export class WorkspaceComponent implements OnInit, OnChanges {

  @Input() data: any;
  @ViewChild('tooltip', {static: false}) tooltipEl: MatTooltip;

  public event: EventEmitter<any> = new EventEmitter();
  public canvas: Canvas;
  public tooltipInfo: any = {};

  constructor(
    private router: Router,
    private dataService: DataService,
    private http: HttpClient
  ) {
    this.canvas = new Canvas(this.event);
  }

  ngOnInit() {
    this.canvas.createCanvas({
      id: 'canvas',
    });

    this.event.subscribe((res: any) => {
      switch (res.status) {

        /**
         * Show information when hover object
         */
        case 'hover':
          this.tooltipInfo = {
            id: res.id,
            type: res.type,
            left: res.event.offsetX,
            top: res.event.offsetY,
          }
          this.tooltipEl.show();
          break;

        /**
         * Hide information when hover out object
         */
        case 'hoverout':
          this.tooltipEl.hide();
          break;

        /**
         * When click object, we navigate to detail route.
         */
        case 'dblclick':
          this.router.navigate(['/topology', res.id]);
          break;
        default:
          break;
      }
    })

    let data = {};
    this.http.get('/api/v1/topology').subscribe(res => {this.data=res;console.log(this.data);this.ngOnChanges()} );
    this.ngOnChanges();
  }

  ngOnChanges() {
    if (this.data) {
      this.canvas.generate(this.data);
    }
  }
}
