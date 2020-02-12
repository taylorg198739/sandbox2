import { CanvasObject } from './object';

export interface ICanvasOption {
  width: number
  height: number,
  viewboxLeft: number,
  viewboxTop: number,
  zoomMin: number,
  zoomMax: number,
  defaultZoom: number,
  isometricUnit: number,
  isometricWidth: number,
  isometricHeight: number,
  id: String,
  maxAPCount: number,
}

export interface IObjectConfig {
  left: number,
  top: number,
  width: number,
  height: number,
  zHeight: number,
  imageWidth: number,
  imageHeight: number,
  level: number,
  id: String,
  type: String,
  expand: boolean,
  showExpand: boolean,
  data: IObjectData,
  originPoint: IPoint,
  points: {
    left: IPoint,
    top: IPoint,
    right: IPoint,
    bottom: IPoint
  }
}

export interface IObjectData {
  status: {
    faults: any,
    vendor: any,
    hostName: any,
    serialNo: any,
    ipv4Net: any,
    id: any,
    role: any,
    macAddress: any,
    ports: any[],
    model: any
  },
  metadata: {
    name: any,
    selfLink: any,
    resourceVersion: any,
    creationTimestamp: any
  },
  spec: any
}

export interface ILinkData {
  spec: any,
  status: {
    localDevice: any,
    localPort: any,
    remoteDevice: any,
    remotePort: any,
    faults: any
  },
  metadata: {
    name: any,
    selfLink: any,
    resourceVersion: any,
    creationTimestamp: any
  }
}

export interface IPoint {
  x: number,
  y: number
}