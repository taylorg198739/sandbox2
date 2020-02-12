import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { data } from '../../../assets/data';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent implements OnInit {

  @Output() generate: EventEmitter<any> = new EventEmitter();

  public data = new FormControl("");

  constructor() { }

  ngOnInit() {
  }

  public onGenerate(): void {
    if (this.data.value) {
      console.log(JSON.parse(this.data.value));
      this.generate.emit({
        data: JSON.parse(this.data.value),
      });
    }
  }
}
