import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { KalturaReportInterval } from 'kaltura-ngx-client';
import * as moment from 'moment';
import { DateFilterUtils } from 'shared/components/date-filter/date-filter-utils';

export enum TimeRanges {
  TenSeconds = 'TenSeconds',
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
}

export enum DateRanges {
  LastHour = 'lastHour',
  Last3H = 'last3hours',
  Last6H = 'last6hours',
  Last12H = 'last12hours',
  Last24H = 'last24hours',
  Last3D = 'last3days',
  Last7D = 'last7days',
  Last30D = 'last30days',
  Last3M = 'last3months',
  Last12M = 'last12months',
  CurrentWeek = 'currentWeek',
  CurrentMonth = 'currentMonth',
  CurrentQuarter = 'currentQuarter',
  CurrentYear = 'currentYear',
  PreviousMonth = 'previousMonth',
  SinceCreation = 'sinceCreation',
}

export enum DateFilterQueryParams {
  dateBy = 'dateBy',
  dateFrom = 'dateFrom',
  dateTo = 'dateTo',
  compareTo = 'compareTo',
}

export enum DateRangeType {
  LongTerm = 0,
  ShortTerm = 1
}

export type DateChangeEvent = {
  startDate: number;
  endDate: number;
  startDay: string;
  endDay: string;
  timeUnits: KalturaReportInterval;
  timeZoneOffset: number;
  applyIn?: string;
  changeOnly?: string;
  dateRange?: DateRanges;
  compare: {
    active: boolean;
    startDate: number;
    startDay: string;
    endDate: number;
    endDay: string;
  };
};

@Injectable()
export class DateFilterService {

  constructor(private _translate: TranslateService) {
  }
  
  public getDateRangeByString(value: string): DateRanges {
    switch (value) {
      case 'lastHour':
        return DateRanges.LastHour;
      case 'last3hours':
        return DateRanges.Last3H;
      case 'last6hours':
        return DateRanges.Last6H;
      case 'last12hours':
        return DateRanges.Last12H;
      case 'last24hours':
        return DateRanges.Last24H;
      case 'last3days':
        return DateRanges.Last3D;
      case 'last7days':
        return DateRanges.Last7D;
      case 'last30days':
        return DateRanges.Last30D;
      case 'last3months':
        return DateRanges.Last3M;
      case 'last12months':
        return DateRanges.Last12M;
      case 'currentWeek':
        return DateRanges.CurrentWeek;
      case 'currentMonth':
        return DateRanges.CurrentMonth;
      case 'currentQuarter':
        return DateRanges.CurrentQuarter;
      case 'currentYear':
        return DateRanges.CurrentYear;
      case 'previousMonth':
        return DateRanges.PreviousMonth;
      case 'sinceCreation':
        return DateRanges.SinceCreation;
      default:
        return null;
    }
  }
  
  public getTimeRangeList(dateRange: DateRanges): SelectItem[] {
    return [
      {
        value: TimeRanges.TenSeconds,
        label: this._translate.instant('app.dateFilter.10sec'),
        disabled: dateRange !== DateRanges.LastHour,
      },
      {
        value: TimeRanges.Minute,
        label: this._translate.instant('app.dateFilter.minutes'),
        disabled: [DateRanges.Last3H, DateRanges.Last6H, DateRanges.Last12H].indexOf(dateRange) === -1,
      },
      {
        value: TimeRanges.Hour,
        label: this._translate.instant('app.dateFilter.hours'),
        disabled: dateRange === DateRanges.LastHour,
      },
      {
        value: TimeRanges.Day,
        label: this._translate.instant('app.dateFilter.days'),
        disabled: [DateRanges.Last3D, DateRanges.Last7D].indexOf(dateRange) === -1,
      },
    ];
  }
  

  public getDateRange(dateRangeType: DateRangeType, period: string, creationDate?: moment.Moment): SelectItem[] {
    let selectItemArr: SelectItem[] = [];

    switch (dateRangeType) {
      case DateRangeType.LongTerm:
        if (period === 'last') {
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.last7d'),
            value: {val: DateRanges.Last7D, tooltip: this.getDateRangeDetails(DateRanges.Last7D).label}
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.last30d'),
            value: {val: DateRanges.Last30D, tooltip: this.getDateRangeDetails(DateRanges.Last30D).label}
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.last3m'),
            value: {val: DateRanges.Last3M, tooltip: this.getDateRangeDetails(DateRanges.Last3M).label}
            });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.last12m'),
            value: {val: DateRanges.Last12M, tooltip: this.getDateRangeDetails(DateRanges.Last12M).label}
            });

          if (creationDate) {
            selectItemArr.push({
              label: this._translate.instant('app.dateFilter.sinceCreation'),
              value: {val: DateRanges.SinceCreation, tooltip: this.getDateRangeDetails(DateRanges.SinceCreation, creationDate).label}
            });
          }
        }
        if (period === 'current') {
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.week'),
            value: {val: DateRanges.CurrentWeek, tooltip: this.getDateRangeDetails(DateRanges.CurrentWeek).label}
            });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.month'),
            value: {val: DateRanges.CurrentMonth, tooltip: this.getDateRangeDetails(DateRanges.CurrentMonth).label}
            });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.quarter'),
            value: {val: DateRanges.CurrentQuarter, tooltip: this.getDateRangeDetails(DateRanges.CurrentQuarter).label}
            });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.year'),
            value: {val: DateRanges.CurrentYear, tooltip: this.getDateRangeDetails(DateRanges.CurrentYear).label}
            });
        }
        break;
      case DateRangeType.ShortTerm:
        if (period === 'last') {
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.hour'),
            value: { val: DateRanges.LastHour, tooltip: this.getDateRangeDetails(DateRanges.LastHour, true).label }
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.3hours'),
            value: { val: DateRanges.Last3H, tooltip: this.getDateRangeDetails(DateRanges.Last3H, true).label }
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.6hours'),
            value: { val: DateRanges.Last6H, tooltip: this.getDateRangeDetails(DateRanges.Last6H, true).label }
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.12hours'),
            value: { val: DateRanges.Last12H, tooltip: this.getDateRangeDetails(DateRanges.Last12H, true).label }
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.24hours'),
            value: { val: DateRanges.Last24H, tooltip: this.getDateRangeDetails(DateRanges.Last24H, true).label }
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.3days'),
            value: { val: DateRanges.Last3D, tooltip: this.getDateRangeDetails(DateRanges.Last3D, true).label }
          });
          selectItemArr.push({
            label: this._translate.instant('app.dateFilter.7days'),
            value: { val: DateRanges.Last7D, tooltip: this.getDateRangeDetails(DateRanges.Last7D, true).label }
          });
        }
        break;
      default:
        break;
    }

    return selectItemArr;
  }

  public getDateRangeDetails(selectedDateRange: DateRanges, staticLabel = false, creationDate?: moment.Moment): { startDate: Date,  endDate: Date, label: string} {
    const today: Date = new Date();
    const m = moment();
    const yesterday = m.subtract(1, 'days').toDate();
    let startDate, endDate: Date;
    let label: string;

    switch (selectedDateRange) {
      case DateRanges.LastHour:
        startDate = m.subtract(1, 'hours').toDate();
        endDate = m.toDate();
        label = this._translate.instant('app.dateFilter.lastHour');
        break;
      case DateRanges.Last3H:
        startDate = m.subtract(3, 'hours').toDate();
        endDate = m.toDate();
        label = this._translate.instant('app.dateFilter.last3hours');
        break;
      case DateRanges.Last6H:
        startDate = m.subtract(6, 'hours').toDate();
        endDate = m.toDate();
        label = this._translate.instant('app.dateFilter.last6hours');
        break;
      case DateRanges.Last12H:
        startDate = m.subtract(12, 'hours').toDate();
        endDate = m.toDate();
        label = this._translate.instant('app.dateFilter.last12hours');
        break;
      case DateRanges.Last24H:
        startDate = m.subtract(24, 'hours').toDate();
        endDate = m.toDate();
        label = this._translate.instant('app.dateFilter.last24hours');
        break;
      case DateRanges.Last3D:
        startDate = m.subtract(3, 'days').toDate();
        endDate = m.toDate();
        label = this._translate.instant('app.dateFilter.last3days');
        break;
      case DateRanges.Last7D:
        if (staticLabel) {
          startDate = m.subtract(7, 'days').toDate();
          endDate = m.toDate();
          label = this._translate.instant('app.dateFilter.last7days');
        } else {
          startDate = m.subtract(6, 'days').toDate();
          endDate = yesterday;
        }
        break;
      case DateRanges.Last30D:
        startDate = m.subtract(29, 'days').toDate();
        endDate = yesterday;
        break;
      case DateRanges.Last3M:
        startDate = m.subtract(3, 'months').toDate();
        endDate = yesterday;
        break;
      case DateRanges.Last12M:
        startDate = m.subtract(12, 'months').toDate();
        endDate = yesterday;
        break;
      case DateRanges.CurrentWeek:
        startDate = m.startOf('week').toDate();
        endDate = today;
        break;
      case DateRanges.CurrentMonth:
        startDate = m.startOf('month').toDate();
        endDate = today;
        break;
      case DateRanges.CurrentQuarter:
        startDate = m.startOf('quarter').toDate();
        endDate = today;
        break;
      case DateRanges.CurrentYear:
        startDate = m.startOf('year').toDate();
        endDate = today;
        break;
      case DateRanges.SinceCreation:
        if (creationDate) {
          startDate = creationDate.startOf('day').toDate();
          endDate = today;
        } else {
          throw Error('creationDate is not provided!');
        }
        break;
    }
    if (!staticLabel) {
      label = DateFilterUtils.getMomentDate(startDate).format('MMM D, YYYY') + ' - ' + DateFilterUtils.getMomentDate(endDate).format('MMM D, YYYY');
    }

    return { startDate, endDate, label };
  }

  public getMaxCompare(startDate: Date, endDate: Date): Date;
  public getMaxCompare(selectedDateRange: DateRanges, creationDate?: moment.Moment): Date;
  public getMaxCompare(selectedDateRange: DateRanges | Date, endDate?: Date | moment.Moment): Date {
    const m = moment();
    let maxDate: Date;

    if (selectedDateRange instanceof Date && endDate instanceof Date) {
      const fromDay = DateFilterUtils.getMomentDate(selectedDateRange);
      const toDay = DateFilterUtils.getMomentDate(endDate);
      const days = moment.duration(toDay.diff(fromDay)).asDays();
      maxDate = fromDay.clone().subtract(days + 1, 'days').toDate();
    } else {
      switch (selectedDateRange) {
        case DateRanges.Last7D:
          maxDate = m.subtract(6, 'days').toDate();
          break;
        case DateRanges.CurrentWeek:
          maxDate = m.subtract(7, 'days').toDate();
          break;
        case DateRanges.Last30D:
          maxDate = m.subtract(29, 'days').toDate();
          break;
        case DateRanges.CurrentMonth:
          maxDate = m.subtract(30, 'days').toDate();
          break;
        case DateRanges.Last3M:
        case DateRanges.CurrentQuarter:
          maxDate = m.subtract(3, 'months').toDate();
          break;
        case DateRanges.Last12M:
        case DateRanges.CurrentYear:
          maxDate = m.subtract(12, 'months').toDate();
          break;
        case DateRanges.SinceCreation:
          const fromDay = (endDate as moment.Moment).clone(); // creationDate
          const toDay = moment();
          const days = moment.duration(toDay.diff(fromDay)).asDays();
          maxDate = fromDay.clone().subtract(days + 1, 'days').toDate();
      }
    }
    return maxDate;
  }

}

