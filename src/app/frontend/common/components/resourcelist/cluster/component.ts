/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
*/

import {HttpParams} from '@angular/common/http';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Cluster, ClusterList, Metric} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';

import {ResourceListBase} from '../../../resources/list';
import {NotificationsService} from '../../../services/global/notifications';
import {EndpointManager} from '../../../services/resource/endpoint';
import {ResourceService} from '../../../services/resource/resource';
import {MenuComponent} from '../../list/column/menu/component';
import {ListGroupIdentifier} from '../groupids';
import {Resource} from '../../../services/resource/endpoint.gen';
import {ListIdentifier} from '../listids.gen';

@Component({
  selector: 'kd-cluster-list',
  templateUrl: './template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClusterListComponent extends ResourceListBase<ClusterList, Cluster> {
  @Input() endpoint = EndpointManager.resource(Resource.cluster).list();
  @Input() showMetrics = false;
  cumulativeMetrics: Metric[];

  constructor(
    private readonly cluster_: ResourceService<ClusterList>,
    notifications: NotificationsService,
    cdr: ChangeDetectorRef,
  ) {
    super('cluster',
      notifications,
      cdr,
    );
    this.id = ListIdentifier.cluster;
    this.groupId = ListGroupIdentifier.setups;

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);

  }

  getResourceObservable(params?: HttpParams): Observable<ClusterList> {
    return this.cluster_.get(this.endpoint, undefined, params);
  }

  //
  map(clusterList: ClusterList): Cluster[] {
    return clusterList.items;
  }

  getDisplayColumns(): string[] {
    return ['name', 'deviceSNMPV2ReadCommunityName', 'age'];
  }
}
