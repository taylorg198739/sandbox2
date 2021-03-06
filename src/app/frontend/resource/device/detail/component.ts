
// GENERATED BY THE UNION OF WAVESURF ROBOTS

/*
Copyright (c) 2019 WaveSurf Systems Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DeviceDetail} from '@api/gen.v1';
import {Subscription} from 'rxjs/Subscription';

import {ActionbarService, ResourceMeta} from '../../../common/services/global/actionbar';
import {NotificationsService} from '../../../common/services/global/notifications';
import {EndpointManager} from '../../../common/services/resource/endpoint';
import {ResourceService} from '../../../common/services/resource/resource';
import {Resource} from '../../../common/services/resource/endpoint.gen';

@Component({
  selector: 'kd-device-detail',
  templateUrl: './template.html',
})
export class DeviceDetailComponent implements OnInit, OnDestroy {
  private deviceSubscription_: Subscription;
  private readonly endpoint_ = EndpointManager.resource(Resource.device);
  device: DeviceDetail;
  isInitialized = false;
  eventListEndpoint: string;

  constructor(
    private readonly device_: ResourceService<DeviceDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly activatedRoute_: ActivatedRoute,
    private readonly notifications_: NotificationsService,
  ) {}

  ngOnInit(): void {
    const resourceName = this.activatedRoute_.snapshot.params.resourceName;

    this.eventListEndpoint = this.endpoint_.child(resourceName, Resource.event);

    this.deviceSubscription_ = this.device_
      .get(this.endpoint_.detail(), resourceName)
      .subscribe((d: DeviceDetail) => {
        this.device = d;
        this.notifications_.pushErrors(d.errors);
        this.actionbar_.onInit.emit(new ResourceMeta('Device', d.objectMeta, d.typeMeta));
        this.isInitialized = true;
      });
  }

  ngOnDestroy(): void {
    this.deviceSubscription_.unsubscribe();
    this.actionbar_.onDetailsLeave.emit();
  }
}
