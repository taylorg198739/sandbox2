import { EventEmitter } from '@angular/core';
import { ICanvasOption, IObjectData, ILinkData, IPoint } from './canvas.model';
import { convert } from './util';
import { CanvasObject } from './object';
import { OBJECT_TYPE, OBJECT_CONFIG } from './constants';
// import { data } from '../../assets/data';

declare const SVG: any;

const DEFAULT_CONFIG: ICanvasOption = {
  id: 'canvas',
  width: 2000,
  height: 1500,
  viewboxLeft: -1000,
  viewboxTop: 50,
  zoomMin: 0.5,
  zoomMax: 20,
  isometricUnit: 12,
  isometricWidth: 80,
  isometricHeight: 100,
  defaultZoom: 1,
  maxAPCount: 30
}

const MIN_WIDTH_SPACE = 2;
const MIN_HEIGHT_SPACE = 4;
const MAX_SWITCH_PER_ROW = 14;
const MAX_AP_PER_ROW = 40;

export class Canvas {
  public canvas: any;
  public option: ICanvasOption;
  public convert: any;
  public eventEmitter: EventEmitter<any>;
  public data: any;

  public conns: any;
  public markers: any;
  public nodes: any;
  public texts: any;
  public grid: any;

  public objects: CanvasObject[] = [];
  public links: any[] = [];

  private MIN_HEIGHT: any;

  constructor(
    eventEmitter: EventEmitter<any>
  ) {
    this.eventEmitter = eventEmitter;
  }

  getCanvas() {
    return this.canvas;
  }

  createCanvas(option: any) {
    this.option = {
      ...DEFAULT_CONFIG,
      ...this.option,
      ...option
    };

    this.canvas = SVG(this.option.id)
    .viewbox(this.option.viewboxLeft, this.option.viewboxTop, this.option.width, this.option.height)
    .panZoom({
      zoomMin: this.option.zoomMin,
      zoomMax: this.option.zoomMax
    });

    this.convert = convert(this.option.isometricUnit);

    this.grid = this.canvas.group();
    this.conns = this.canvas.group();
    this.markers = this.canvas.group();
    this.nodes = this.canvas.group();
    this.texts = this.canvas.group();

    // this._drawGrid();
    this.MIN_HEIGHT = Infinity;
  }

  createObject(type: string, data: any): CanvasObject {
    let object = new CanvasObject(this.getCanvas(), this.convert, this.eventEmitter, {data, ...OBJECT_CONFIG[type]});
    return object.create(this.nodes);
  }

  generate(data: any) {
    this.clear();
    this.data = data;

    const objects = data['objects']['items'];
    objects.forEach((object: IObjectData) => {
      let obj = this.createObject(object.status.role, object);
      obj.get().hide();
      this.objects.push(obj);
    });

    this.autoAlign();

    const links = data['links']['items'];
    const cons: any[] = [];
    links.forEach((link: ILinkData) => {
      let source = this.objects.find((object: CanvasObject) => object.data.status.hostName === link.status.localDevice)
      let target = this.objects.find((object: CanvasObject) => object.data.status.hostName === link.status.remoteDevice)
      if (source && target) {
        let alt = cons.find((con) => con.source === target.data.status.hostName && con.target === source.data.status.hostName);
        this.links.push(this.connect(source, target, alt ? true : false));
  
        cons.push({
          source: source.data.status.hostName,
          target: target.data.status.hostName
        });
      }
    });
  }

  autoAlign() {
    let objects: any = {};
    const links = this.data['links']['items'];

    for(let type in OBJECT_TYPE) {
      const level = OBJECT_CONFIG[OBJECT_TYPE[type]].level;
      !objects[level] ? objects[level] = [] : null;

      const items = this.objects.filter((object) => object.data.status.role === OBJECT_TYPE[type]);

      items.forEach(item => {
        let child: any[] = [];
        links.forEach((link: any) => {
          if (link.status.localDevice === item.data.status.hostName) {
            console.log(link);
            console.log(item);
            let obj = this.objects.find((object) => object.data.status.hostName === link.status.remoteDevice)
            console.log(obj);
            if (obj && item.config.level < obj.config.level) child.push(obj)
          }
        });

        item.children = child;
        objects[level].push(item);
      });
    }

    let switchRows: any = [];
    let switchCountsPerRow = this._getSwitchCountsPerRow(objects[3].length);
    let index = 0;
    switchCountsPerRow.forEach((number) => {
      let row = [];
      for (let i = 0; i < number; i ++)
        row.push(objects[3][index]), index++;
      switchRows.push(row);
    });

    let MAX_X = -Infinity;
    let MAX_Y = -Infinity;
    let xPos: any;
    let yPos = 0;
    switchRows.forEach((row: any) => {
      xPos = 0;

      let totalChildrenCount = 0
      row.forEach((item: CanvasObject) => totalChildrenCount += item.children.length);
      let maxHeight = -Infinity;

      row.forEach((item: CanvasObject) => {
        item.get().show();
        maxHeight < (item.height() + item.config.zHeight) ? maxHeight = (item.height() + item.config.zHeight) : null;

        if (totalChildrenCount > MAX_AP_PER_ROW || switchRows.length > 1) {
          item.config.showExpand = true;
          item.move(xPos, yPos);
          MAX_X < (item.offset().left + item.width()) ? (MAX_X = item.offset().left + item.width()) : null;
          MAX_Y < (item.offset().top + item.height()) ? (MAX_Y = item.offset().top + item.height()) : null;

          if (item.expand === false) {
            item.children.forEach((child: CanvasObject) => {
              child.get().hide();
              child.move(xPos, yPos);
            });
          } else {
            let children_width = item.children.length === 0 ? 0 : (item.children[0].width() * item.children.length) + (item.children.length - 1) * MIN_WIDTH_SPACE;
            let max_width = children_width;

            item.children.forEach((child: CanvasObject, child_index) => {
              child.get().show();
              child.move(Math.floor((xPos + item.width() / 2 - max_width / 2) + child_index * (child.width() + MIN_WIDTH_SPACE)), yPos + item.height() + item.config.zHeight + MIN_HEIGHT_SPACE);
            });
            maxHeight += (item.children.length === 0 ? 0 : (item.children[0].height() + MIN_HEIGHT_SPACE));
          }
          xPos += item.width() + MIN_WIDTH_SPACE;
        } else {
          item.config.showExpand = false;
          let children_width = item.children.length === 0 ? 0 : (item.children[0].width() * item.children.length) + (item.children.length - 1) * MIN_WIDTH_SPACE;
          let max_width = Math.max(item.width(), children_width);
          maxHeight += (item.children.length === 0 ? 0 : (item.children[0].height()));

          item.move((max_width - item.width()) / 2 + xPos, yPos);
          
          item.children.forEach((child: CanvasObject, child_index) => {
            child.get().show();
            child.move(Math.floor(xPos + (max_width - children_width) / 2 + child_index * (child.width() + MIN_WIDTH_SPACE)), yPos + item.height() + item.config.zHeight + MIN_HEIGHT_SPACE);

            MAX_X < (child.offset().left + child.width()) ? (MAX_X = child.offset().left + child.width()) : null;
            MAX_Y < (child.offset().top + child.height()) ? (MAX_Y = child.offset().top + child.height()) : null;
          });

          MAX_X < (item.offset().left + max_width) ? (MAX_X = (item.offset().left + max_width)) : null;
          MAX_Y < (item.offset().top + item.height()) ? (MAX_Y = item.offset().top + item.height()) : null;
          xPos += max_width + MIN_WIDTH_SPACE;
        }
      });
      yPos += maxHeight + MIN_HEIGHT_SPACE;
    });

    yPos = -MIN_HEIGHT_SPACE-4;
    for (let i = 2; i >= 0; i --) {
      if (objects[i].length) {
        const max_width = objects[i].length * objects[i][0].width() + (objects[i].length - 1) * MIN_WIDTH_SPACE;
        xPos = (MAX_X - max_width) / 2;
        yPos -= objects[i][0].height();
        objects[i].forEach((object: CanvasObject) => {
          object.get().show();
          object.move(xPos, yPos);
          xPos += object.width() + MIN_WIDTH_SPACE;
        });
        yPos -= (objects[i][0].config.zHeight + MIN_HEIGHT_SPACE);
      }
    }
    yPos += 5;
    MAX_Y -= yPos;

    this.MIN_HEIGHT > MAX_Y ? this.MIN_HEIGHT = MAX_Y : null;

    const offset = {
      left: Math.floor((this.option.isometricWidth - MAX_X) / 2),
      top: Math.floor((this.option.isometricHeight - this.MIN_HEIGHT) / 2)
    }

    this.objects.forEach((object) => {
      object.move(object.offset().left + offset.left, object.offset().top + offset.top - yPos);
      object._move();
    });
    this.objects.forEach((object) => {
      if (object.config.level === 3 && object.children.length && object.config.showExpand === true) {
        if (object.expand === false) {
          object.children.forEach((child: CanvasObject) => {
            this.confirmConnector(object, child);
          });
        } else {
          object.children.forEach((child: CanvasObject) => {
            this.confirmConnector(object, child);
          });
        }
        this.createTextForSwitch(this.objects, object);
      }
    })
  }

  /**
   * 
   * @param objects Total objects to search switch object
   * @param sw      Switch object which has many APs.
   * @param apCount Number of APs per switch
   */
  createTextForSwitch(objects: CanvasObject[], sw: CanvasObject) {
    let group = this.texts.group();
    let rect2 = group.rect(42, 12).fill('#aaa');
    let rect1 = group.rect(40, 10).fill('#fff').stroke(sw.expand ? '#f00' : '#00f');
    let text = group.text(function(add: any) {
      add.tspan(`${sw.expand ? '-' : '+'} ${sw.children.length} APs`);
    });

    rect1.move(...this.convert([sw.offset().left + 0.4, sw.offset().top + sw.height() + 2]))
    .transform({
      skewX: -60,
      skewY: 30,
    });
    rect2.move(...this.convert([sw.offset().left + 0.4, sw.offset().top + sw.height() + 2]))
    .transform({
      skewX: -60,
      skewY: 30,
    });
    text.move(...this.convert([sw.offset().left + 0.8, sw.offset().top + sw.height() + 1.6]))
    .transform({
      skewX: -60,
      skewY: 30,
    })
    .font({size: '8px'});
    group.switchId = sw.id();

    const _this = this;
    group.on('click', function() {
      objects.forEach((object) => {
        if (object.id() !== group.switchId) {
          object.expand = false;
        } else {
          object.expand = !object.expand;
        }
      });

      _this.texts.clear();
      _this.autoAlign();
    });
  }

  connect(obj1: CanvasObject, obj2: CanvasObject, isOffset: boolean) {

    let con = obj1.get().connectable({
      container: this.conns,
      markers: this.markers,
      color: '#2a88c9'
    }, obj2.get());

    con = this.confirmConnector(obj1, obj2);

    if (isOffset) {
      // con.connector.move(con.connector.x(), con.connector.y() - 10);
      // con.setConnectorColor('#f00');
    }

    return con;
  }

  confirmConnector(obj1: CanvasObject, obj2: CanvasObject) {
    let points = this._nearestPoints(obj1, obj2);
    if (obj1.get().cons) {
      let con = obj1.get().cons.find((con: any) => con.target === obj2.get());

      con.connector.plot(`M ${points[0]} ${points[1]} L ${points[2]} ${points[3]}`);
  
      return con;
    }
    else return null;
  }

  clear() {
    this.nodes.clear();
    this.conns.clear();
    this.markers.clear();
    this.texts.clear();

    this.links = [];
    this.objects = [];
    this.MIN_HEIGHT = Infinity;
    this.data = {};
  }

  /**
   * 
   * @param obj1 CanvasObject
   * @param obj2 CanvasObject
   * 
   * Each canvas object has some points to be connected. We return the proper points depends on the position of the objects.
   * return format: [x1, y1, x2, y2]
   */
  _nearestPoints(obj1: CanvasObject, obj2: CanvasObject) {
    let P1, P2;
    if (obj1.offset().top < obj2.offset().top) {
      P1 = obj1.config.points.bottom;
      P2 = obj2.config.points.top;
    } else if (obj1.offset().top > obj2.offset().top) {
      P1 = obj1.config.points.top;
      P2 = obj2.config.points.bottom;
    } else {
      P1 = obj1.config.points.right;
      P2 = obj2.config.points.left;
    }

    return [P1.x + obj1.get().x(), P1.y + obj1.get().y(), P2.x + obj2.get().x(), P2.y + obj2.get().y()];
  }

  _getSwitchCountsPerRow(n: number) {
    let rows = Math.floor(n / MAX_SWITCH_PER_ROW) + 1;
    let result = [];
    let temp = parseInt(n.toString());
    for (let i = 1; i <= rows; i ++) {
      if (i === rows) result.push(temp);
      else {
        const val = Math.floor(n / rows) + 1;
        result.push(val);
        temp -= val;
      }
    }
    return result;
  }

  _drawGrid() {
    var pattern_w = Math.sin(SVG.math.rad(60)) * (2 * this.option.isometricUnit)
    var pattern_h = this.option.isometricUnit
    var pattern = this.canvas.pattern(pattern_w, pattern_h, function(add: any) {
      add.line(0, 0, pattern_w, pattern_h)
      add.line(pattern_w, 0, 0, pattern_h)
    }).stroke("#ddd")

    var pointsOfGrid = {
      leftTop: [
        0,
        0
      ],
      rightTop: [
        this.option.isometricUnit * this.option.isometricWidth * Math.sin(SVG.math.rad(60)),
        this.option.isometricUnit * this.option.isometricWidth * Math.cos(SVG.math.rad(60))
      ],
      rightBottom: [
        this.option.isometricUnit * (this.option.isometricWidth - this.option.isometricHeight) * Math.sin(SVG.math.rad(60)),
        this.option.isometricUnit * (this.option.isometricWidth + this.option.isometricHeight) * Math.cos(SVG.math.rad(60)),
      ],
      leftBottom: [
        this.option.isometricUnit * (-1) * (this.option.isometricHeight) * Math.sin(SVG.math.rad(60)),
        this.option.isometricUnit * this.option.isometricHeight * Math.cos(SVG.math.rad(60)),
      ]
    }

    var area = this.canvas.polygon([
      pointsOfGrid.leftTop,
      pointsOfGrid.rightTop,
      pointsOfGrid.rightBottom,
      pointsOfGrid.leftBottom
    ]).fill(pattern);

    this.grid.add(area)
  }
}