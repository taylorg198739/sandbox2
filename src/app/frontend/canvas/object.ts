import { IObjectConfig, IObjectData } from './canvas.model';
import { v1 as uuid } from 'uuid';
import { EventEmitter } from '@angular/core';

export class CanvasObject {
  public object: any;
  public canvas: any;
  public convert: any;
  public config: IObjectConfig;
  public children: CanvasObject[];
  public eventEmitter: EventEmitter<any>;

  constructor(canvas: any, convert: any, eventEmitter: any, config?: IObjectConfig) {
    this.canvas = canvas;
    this.config = {
      ...this.config,
      ...config
    };
    this.config.id = uuid();
    this.convert = convert;
    this.eventEmitter = eventEmitter;
    this.config.expand = false;
    this.config.showExpand = false;
    this.children = [];
  }

  get() {
    return this.object;
  }

  width() {
    return this.config.width;
  }

  height() {
    return this.config.height;
  }

  type() {
    return this.config.type;
  }

  id() {
    return this.config.id;
  }

  offset() {
    return {
      left: this.config.left,
      top: this.config.top
    }
  }

  create(nodes: any) {
    this.object = nodes.group();
    this.config.type && this.object.image(`assets/images/${this.config.type.toLowerCase()}.svg`, this.config.imageWidth, this.config.imageHeight)
                .attr('id', this.config.id);

    this.move(this.config.left, this.config.top);

    this.object.on('mouseover', (event: any) => {
      this.object.animate(100).transform({scale: 1.1});
      this.eventEmitter.emit({
        id: this.config.id,
        type: this.config.type.toUpperCase(),
        status: 'hover',
        event
      });
    });

    this.object.on('mouseout', () => {
      this.object.animate(100).transform({scale: 1});

      this.eventEmitter.emit({
        status: 'hoverout'
      })
    });

    this.object.on('dblclick', () => {
      this.eventEmitter.emit({
        status: 'dblclick',
        id: this.config.id
      })
    });

    return this;
  }

  move(i: number, j: number) {
    this.config.left = i;
    this.config.top = j;
  }

  _move() {
    this.config.originPoint && this.object.move(this.convert([this.config.left, this.config.top])[0] - this.config.originPoint.x, this.convert([this.config.left, this.config.top])[1] - this.config.originPoint.y);
  }

  remove() {
    this.object.clear();
  }

  get expand() {
    return this.config.expand;
  }

  set expand(expand) {
    this.config.expand = expand;
  }

  get data(): IObjectData {
    return this.config.data;
  }

  set data(data) {
    this.config.data = data;
  }
}
