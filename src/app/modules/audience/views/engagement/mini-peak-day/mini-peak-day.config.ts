import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReportDataBaseConfig, ReportDataConfig, ReportDataSection } from 'shared/services/storage-data-base.config';
import { ReportHelper } from 'shared/services';
import {DateFilterUtils} from "shared/components/date-filter/date-filter-utils";
import {analyticsConfig} from "configuration/analytics-config";

@Injectable()
export class MiniPeakDayConfig extends ReportDataBaseConfig {
  constructor(_translate: TranslateService) {
    super(_translate);
  }
  
  public getConfig(): ReportDataConfig {
    return {
      [ReportDataSection.graph]: {
        fields: {
          'count_plays': {
            format: value => value,
          },
          'sum_time_viewed': {
            format: value => value,
          },
          'avg_time_viewed': {
            format: value => value,
          },
          'count_loads': {
            format: value => value,
            parse: value => parseFloat(value),
          },
        }
      },
      [ReportDataSection.table]: {
        fields: {
          'name': {
            format: value => value,
            nonComparable: true,
          },
          'unique_videos': {
            format: value => ReportHelper.numberOrZero(value),
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
          'avg_view_drop_off': {
            format: value => ReportHelper.numberOrZero(value),
          },
          'count_loads': {
            format: value => ReportHelper.numberOrZero(value),
          },
          'load_play_ratio': {
            format: value => ReportHelper.numberOrZero(value),
          }
        }
      }
    };
  }
}
