import { RequestFactory } from '@kaltura-ng/kaltura-common';
import { KalturaEndUserReportInputFilter, KalturaFilterPager, KalturaMultiRequest, KalturaMultiResponse, KalturaReportInterval, KalturaReportResponseOptions, KalturaReportType, ReportGetTableAction, ReportGetTableActionArgs } from 'kaltura-ngx-client';
import { analyticsConfig } from 'configuration/analytics-config';
import * as moment from 'moment';
import { OnPollTickSuccess } from 'shared/services/server-polls-base.service';
import { reportTypeMap } from 'shared/utils/report-type-map';
import { DateRangeServerValue } from '../live-discovery-chart/filters/filters.service';

export class LiveDevicesRequestFactory implements RequestFactory<KalturaMultiRequest, KalturaMultiResponse>, OnPollTickSuccess {
  private readonly _responseOptions = new KalturaReportResponseOptions({
    delimiter: analyticsConfig.valueSeparator,
    skipEmptyDates: analyticsConfig.skipEmptyBuckets
  });
  
  private _interval = KalturaReportInterval.tenSeconds;
  
  private _dateRange: DateRangeServerValue = {
    toDate: moment().unix(),
    fromDate: moment().subtract(1, 'minute').unix(),
  };
  
  private _getTableActionArgs: ReportGetTableActionArgs = {
    reportType: reportTypeMap(KalturaReportType.platformsRealtime),
    reportInputFilter: new KalturaEndUserReportInputFilter({
      toDate: this._dateRange.toDate,
      fromDate: this._dateRange.fromDate,
      interval: this._interval,
    }),
    pager: new KalturaFilterPager({ pageSize: 25 }),
    order: null,
    responseOptions: this._responseOptions
  };
  
  public set dateRange(range: DateRangeServerValue) {
    if (range.hasOwnProperty('toDate') && range.hasOwnProperty('fromDate')) {
      this._dateRange = range;
      this.onPollTickSuccess();
    }
  }
  
  public set interval(interval: KalturaReportInterval) {
    if (KalturaReportInterval[interval] !== null) {
      this._interval = interval;
      this._getTableActionArgs.reportInputFilter.interval = interval;
    }
  }
  
  constructor(private _entryId: string) {
    this._getTableActionArgs.reportInputFilter.entryIdIn = this._entryId;
  }
  
  public onPollTickSuccess(): void {
    this._getTableActionArgs.reportInputFilter.toDate = this._dateRange.toDate;
    this._getTableActionArgs.reportInputFilter.fromDate = this._dateRange.fromDate;
  }
  
  public create(): KalturaMultiRequest {
    return new KalturaMultiRequest(
      new ReportGetTableAction(this._getTableActionArgs),
    );
  }
}
