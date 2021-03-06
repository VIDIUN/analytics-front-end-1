import { Injectable } from '@angular/core';
import { AnalyticsServerPollsBase } from 'shared/services/server-polls-base.service';
import { KalturaClient } from 'kaltura-ngx-client';

@Injectable()
export class EntryLiveGeoDevicesPollsService extends AnalyticsServerPollsBase {
  constructor(protected _kalturaClient: KalturaClient) {
    super(_kalturaClient);
  }
}
