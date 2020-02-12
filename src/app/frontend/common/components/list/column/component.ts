// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {ActionColumn} from '@api/frontendapi';
import {Resource} from '@api/backendapi.base';

@Component({
  selector: 'kd-dynamic-cell',
  templateUrl: './template.html',
})
export class ColumnComponent<T extends ActionColumn> implements OnChanges {
  @Input() component: Type<T>;
  @Input() resource: Resource;
  @ViewChild('target', {read: ViewContainerRef, static: true}) target: ViewContainerRef;
  private componentRef_: ComponentRef<T> = undefined;

  constructor(private readonly resolver_: ComponentFactoryResolver) {}

  ngOnChanges(): void {
    if (this.componentRef_) {
      this.target.remove();
      this.componentRef_ = undefined;
    }

    const factory = this.resolver_.resolveComponentFactory(this.component);
    this.componentRef_ = this.target.createComponent(factory);
    this.componentRef_.instance.setObjectMeta(this.resource.objectMeta);
    this.componentRef_.instance.setTypeMeta(this.resource.typeMeta);
  }
}
