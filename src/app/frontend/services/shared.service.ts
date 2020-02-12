import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    mode = new BehaviorSubject(true);
    toggleMode(mode) {
        this.mode.next(mode);
    }
    constructor() { }
}
