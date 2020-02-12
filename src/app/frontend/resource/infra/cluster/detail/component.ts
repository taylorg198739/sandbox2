/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClusterDetail} from '@api/backendapi';
import {Subscription} from 'rxjs/Subscription';

import {ActionbarService, ResourceMeta} from '../../../../common/services/global/actionbar';
import {NotificationsService} from '../../../../common/services/global/notifications';
import {EndpointManager} from '../../../../common/services/resource/endpoint';
import {ResourceService} from '../../../../common/services/resource/resource';
import {Resource} from '../../../../common/services/resource/endpoint.gen';

@Component({
  selector: 'kd-cluster-detail',
  templateUrl: './template.html',
})
export class ClusterDetailComponent implements OnInit, OnDestroy {
  private clusterSubscription_: Subscription;
  private readonly endpoint_ = EndpointManager.resource(Resource.cluster);
  cluster: ClusterDetail;
  isInitialized = false;
  eventListEndpoint: string;

  constructor(
    private readonly cluster_: ResourceService<ClusterDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly activatedRoute_: ActivatedRoute,
    private readonly notifications_: NotificationsService,
  ) {}

  ngOnInit(): void {
    const resourceName = this.activatedRoute_.snapshot.params.resourceName;

    this.eventListEndpoint = this.endpoint_.child(resourceName, Resource.event);

    this.clusterSubscription_ = this.cluster_
      .get(this.endpoint_.detail(), resourceName)
      .subscribe((d: ClusterDetail) => {
        this.cluster = d;
        this.notifications_.pushErrors(d.errors);
        this.actionbar_.onInit.emit(new ResourceMeta('Cluster', d.objectMeta, d.typeMeta));
        this.isInitialized = true;
      });
  }

  ngOnDestroy(): void {
    this.clusterSubscription_.unsubscribe();
    this.actionbar_.onDetailsLeave.emit();
  }
}
