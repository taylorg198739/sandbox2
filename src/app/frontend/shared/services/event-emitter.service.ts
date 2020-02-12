import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  constructor() { }

  events: any = {};
  api = {
    broadcast: this.broadcast,
    subscribe: this.subscribe
  };

  broadcast(event: any, data: any) {
    if (!this.events[event]) return;

    this.events[event].forEach((callback: any) => {

      return callback(data);
    });
  }

  subscribe(eventName: any, callback: any) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);

    return this.generateUnsubscribe(eventName, callback);
  }

  generateUnsubscribe(eventName: any, callback: any) {
    const _this = this;
    return function unsubscribe() {
      var callbacks = _this.events[eventName];

      for(var i = 0; i < callbacks.length; i++) {
        if (callbacks[i] == callback) {
          callbacks.splice(i, 1);
          return;
        }
      }
    };
  }
}
