import { Component } from '@angular/core';
import { DateChangeEvent, DateRanges } from 'shared/components/date-filter/date-filter.service';
import { KalturaEndUserReportInputFilter, KalturaReportInterval, KalturaReportType } from 'kaltura-ngx-client';
import { KalturaLogger } from '@kaltura-ng/kaltura-logger';
import { RefineFilter } from 'shared/components/filter/filter.component';
import { ContentInteractionsExportConfig } from './content-interactions-export.config';
import { ExportItem } from 'shared/components/export-csv/export-config-base.service';
import { analyticsConfig } from 'configuration/analytics-config';

@Component({
  selector: 'app-content-interactions',
  templateUrl: './content-interactions.component.html',
  styleUrls: ['./content-interactions.component.scss'],
  providers: [
    ContentInteractionsExportConfig,
    KalturaLogger.createLogger('ContentInteractionsComponent'),
  ]
})
export class ContentInteractionsComponent {
  public _selectedRefineFilters: RefineFilter = null;
  public _dateRange = DateRanges.Last30D;
  public _timeUnit = KalturaReportInterval.days;
  public _totalCount: number;
  public _reportType: KalturaReportType = KalturaReportType.userUsage;
  public _selectedMetrics: string;
  public _dateFilter: DateChangeEvent = null;
  public _refineFilter: RefineFilter = null;
  public _refineFilterOpened = false;
  public _exportConfig: ExportItem[] = [];
  public _contentInteractionsViewConfig = analyticsConfig.viewsConfig.audience.contentInteractions;
  public _miniViewsCount = [
    this._contentInteractionsViewConfig.miniHighlights,
    this._contentInteractionsViewConfig.miniTopVideos,
    this._contentInteractionsViewConfig.miniPeakDay,
  ].filter(Boolean).length;
  public _miniViewsWidth = this._miniViewsCount === 3 ? '30%' : this._miniViewsCount === 2 ? '50%' : '100%';
  public _filter: KalturaEndUserReportInputFilter = new KalturaEndUserReportInputFilter(
    {
      searchInTags: true,
      searchInAdminTags: false
    }
  );
  
  constructor(private _exportConfigService: ContentInteractionsExportConfig) {
    this._exportConfig = _exportConfigService.getConfig();
  }
  
  public _onDateFilterChange(event: DateChangeEvent): void {
    this._dateFilter = event;
  }
  
  public _onRefineFilterChange(event: RefineFilter): void {
    this._refineFilter = event;
  }
}
