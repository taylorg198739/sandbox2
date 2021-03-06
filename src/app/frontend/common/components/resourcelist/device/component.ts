
// GENERATED BY THE UNION OF WAVESURF ROBOTS

import {HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Metric} from '@api/backendapi';
import { Device, DeviceList} from '@api/gen.v1';
import {Observable} from 'rxjs/Observable';

import {ResourceListBase} from '../../../resources/list';
import {NotificationsService} from '../../../services/global/notifications';
import {EndpointManager} from '../../../services/resource/endpoint';
import {Resource} from '../../../services/resource/endpoint.gen';
import {ResourceService} from '../../../services/resource/resource';
import {MenuComponent} from '../../list/column/menu/component';
import {ListGroupIdentifier} from '../groupids';
import {ListIdentifier} from '../listids.gen';

@Component({
  selector: 'kd-device-list',
  templateUrl: './template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent extends ResourceListBase<DeviceList, Device> {
  @Input() endpoint = EndpointManager.resource(Resource.device).list();
  @Input() showMetrics = false;
  cumulativeMetrics: Metric[];

  constructor(
    private readonly device_: ResourceService<DeviceList>,
    notifications: NotificationsService,
    cdr: ChangeDetectorRef,
  ) {
    super('device',
      notifications,
      cdr,
    );
    this.id = ListIdentifier.device;
    this.groupId = ListGroupIdentifier.setups;

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);

  }

  getResourceObservable(params?: HttpParams): Observable<DeviceList> {
    return this.device_.get(this.endpoint, undefined, params);
  }

  map(deviceList: DeviceList): Device[] {
    return deviceList.items;
  }
  getDisplayColumns(): string[] {
    return ['name', 'Vendor', 'Model', 'Serial Number', 'OS', 'Role',  'age'];
  }
}
