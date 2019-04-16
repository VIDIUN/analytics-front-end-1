import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReportDataBaseConfig, ReportDataConfig, ReportDataSection } from 'shared/services/storage-data-base.config';
import { ReportHelper } from 'shared/services';
import { DateFilterUtils } from 'shared/components/date-filter/date-filter-utils';
import { analyticsConfig } from 'configuration/analytics-config';
import { getPrimaryColor, getSecondaryColor } from 'shared/utils/colors';

@Injectable()
export class HighlightsConfig extends ReportDataBaseConfig {
  constructor(_translate: TranslateService) {
    super(_translate);
  }
  
  public getConfig(): ReportDataConfig {
    return {
      [ReportDataSection.graph]: {
        fields: {
          'count_plays': {
            format: value => value,
            colors: [getPrimaryColor(), getSecondaryColor()],
            graphTooltip: (value) => `<span class="kValue">${this._translate.instant(`app.engagement.highlightsReport.count_plays`)}:&nbsp;${ReportHelper.numberOrZero(String(value), false)}</span>`
          },
          'sum_time_viewed': {
            format: value => value,
            colors: [getPrimaryColor('time'), getSecondaryColor('time')],
            graphTooltip: (value) => `<span class="kValue">${this._translate.instant(`app.engagement.highlightsReport.sum_time_viewed`)}:&nbsp;${ReportHelper.numberOrZero(String(value), false)}</span>`
          },
          'avg_time_viewed': {
            format: value => value,
            colors: [getPrimaryColor('viewers'), getSecondaryColor('viewers')],
            graphTooltip: (value) => `<span class="kValue">${this._translate.instant(`app.engagement.highlightsReport.avg_time_viewed`)}:&nbsp;${ReportHelper.numberOrZero(String(value), false)}</span>`
          },
          'count_loads': {
            format: value => value,
            parse: value => parseFloat(value),
            colors: [getPrimaryColor('dropoff'), getSecondaryColor('dropoff')],
            graphTooltip: (value) => `<span class="kValue">${this._translate.instant(`app.engagement.highlightsReport.count_loads`)}:&nbsp;${value}</span>`
          },
        }
      },
      [ReportDataSection.table]: {
        fields: {
          'month_id': {
            format: value => DateFilterUtils.formatMonthString(value, analyticsConfig.locale),
            nonComparable: true,
          },
          'date_id': {
            format: value => DateFilterUtils.formatFullDateString(value, analyticsConfig.locale),
            nonComparable: true,
          },
          'count_plays': {
            format: value => ReportHelper.numberOrZero(value),
          },
          'sum_time_viewed': {
            format: value => ReportHelper.numberOrZero(value),
          },
          'avg_time_viewed': {
            format: value => ReportHelper.numberOrZero(value),
          },
          'count_loads': {
            format: value => ReportHelper.numberOrZero(value),
          },
          'load_play_ratio': {
            format: value => ReportHelper.numberOrZero(value),
          },
          'avg_view_drop_off': {
            format: value => `${ReportHelper.numberOrZero(String(value * 100))} %`,
          },
        }
      },
      [ReportDataSection.totals]: {
        preSelected: 'count_plays',
        fields: {
          'count_plays': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.engagement.highlightsReport.count_plays`),
            tooltip: this._translate.instant(`app.engagement.highlightsReport.count_plays_tt`),
            sortOrder: 1,
          },
          'sum_time_viewed': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.engagement.highlightsReport.sum_time_viewed`),
            tooltip: this._translate.instant(`app.engagement.highlightsReport.sum_time_viewed_tt`),
            units: value => 'min',
            sortOrder: 2,
          },
	  'avg_time_viewed': {
            format: value => ReportHelper.integerOrZero(value),
            title: this._translate.instant(`app.engagement.highlightsReport.avg_time_viewed`),
            tooltip: this._translate.instant(`app.engagement.highlightsReport.avg_time_viewed_tt`),
            sortOrder: 3,
	    },
          'count_loads': {
            format: value => ReportHelper.numberOrZero(String(value * 100)),
            units: value => '%',
            title: this._translate.instant(`app.engagement.highlightsReport.count_loads`),
            tooltip: this._translate.instant(`app.engagement.highlightsReport.count_loads`),
            sortOrder: 4,
          }
        }
      }
    };
  }
}
