import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NgxEchartsModule } from 'shared/ngx-echarts/ngx-echarts.module';

import { routing } from './entry-live.routes';
import { EntryLiveViewComponent } from './entry-live-view.component';
import { SharedModule } from 'shared/shared.module';
import { AreaBlockerModule, InputHelperModule, KalturaUIModule, TagsModule, TooltipModule } from '@kaltura-ng/kaltura-ui';
import { TableModule } from 'primeng/table';
import { EntryDetailsComponent } from './views/entry-details/entry-details.component';
import { LivePlayerComponent } from './views/live-player/live-player.component';
import { LiveStatusComponent } from './views/live-status/live-status.component';
import { EntryLiveWidget } from './entry-live.widget';
import { EntryLiveService } from './entry-live.service';
import { StreamStatePipe } from './pipes/stream-state.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { WidgetsManager } from './widgets/widgets-manager';
import { LiveUsersComponent } from './views/live-users/live-users.component';
import { LiveUsersWidget } from './views/live-users/live-users.widget';
import { LiveBandwidthComponent } from './views/live-bandwidth/live-bandwidth.component';
import { LiveBandwidthWidget } from './views/live-bandwidth/live-bandwidth.widget';
import { LiveStreamHealthComponent } from './views/live-stream-health/live-stream-health.component';
import { LiveStreamHealthWidget } from './views/live-stream-health/live-stream-health.widget';
import { CodeToSeverityPipe } from './views/live-stream-health/pipes/code-to-severity.pipe';
import { SeverityToHealthPipe } from './views/live-stream-health/pipes/severity-to-health.pipe';
import { NotificationTitlePipe } from './views/live-stream-health/pipes/notification-title.pipe';
import { CodeToHealthIconPipe } from './views/live-stream-health/pipes/code-to-health-icon.pipe';
import { EntryLiveGeneralPollsService } from './providers/entry-live-general-polls.service';
import { EntryLiveGeoDevicesPollsService } from './providers/entry-live-geo-devices-polls.service';
import { LiveGeoComponent } from './views/live-geo/live-geo.component';
import { LiveGeoWidget } from './views/live-geo/live-geo.widget';
import { LiveGeoConfig } from './views/live-geo/live-geo.config';
import { LiveDevicesComponent } from './views/live-devices/live-devices.component';
import { LiveDevicesConfig } from './views/live-devices/live-devices.config';
import { LiveDevicesWidget } from './views/live-devices/live-devices.widget';

@NgModule({
  imports: [
    AreaBlockerModule,
    TagsModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    SharedModule,
    TableModule,
    TooltipModule,
    NgxEchartsModule,
    RouterModule.forChild(routing),
    KalturaUIModule,
    InputHelperModule,
  ],
  declarations: [
    EntryLiveViewComponent,
    EntryDetailsComponent,
    LivePlayerComponent,
    LiveStatusComponent,
    StreamStatePipe,
    DurationPipe,
    LiveUsersComponent,
    LiveBandwidthComponent,
    LiveStreamHealthComponent,
    CodeToSeverityPipe,
    SeverityToHealthPipe,
    NotificationTitlePipe,
    CodeToHealthIconPipe,
    LiveGeoComponent,
    LiveDevicesComponent,
  ],
  exports: [],
  providers: [
    CodeToSeverityPipe,
    SeverityToHealthPipe,
    WidgetsManager,
    EntryLiveService,
    LiveGeoConfig,
    LiveDevicesConfig,
    
    // polls services
    EntryLiveGeneralPollsService,
    EntryLiveGeoDevicesPollsService,

    // widgets
    EntryLiveWidget,
    LiveUsersWidget,
    LiveBandwidthWidget,
    LiveStreamHealthWidget,
    LiveGeoWidget,
    LiveDevicesWidget,
  ]
})
export class EntryLiveModule {
}
