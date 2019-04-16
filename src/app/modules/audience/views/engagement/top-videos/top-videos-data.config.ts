import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReportDataConfig, ReportDataSection, ReportDataBaseConfig } from 'shared/services/storage-data-base.config';
import { ReportHelper } from 'shared/services';
import * as moment from 'moment';

@Injectable()
export class TopVideosDataConfig extends ReportDataBaseConfig {
  constructor(_translate: TranslateService) {
    super(_translate);
  }
  public getConfig(): ReportDataConfig {
    return {
      [ReportDataSection.table]: {
        fields: {
          'object_id': {
            format: value => value,
            hidden: true,
          },
          'entry_name': {
            format: value => value,
            sortOrder: 1,
          },
          'count_plays': {
            format: value => value,
            sortOrder: 2,
          },
           'sum_time_viewed': {
             format: value => ReportHelper.format('serverDate', value),
            sortOrder: 3,
          },
          'avg_time_viewed': {
            format: value => ReportHelper.numberOrZero(value),
            sortOrder: 4,
          },
          'count_loads': {
            format: value => ReportHelper.numberOrZero(value),
            sortOrder: 6,
          },
          'load_play_ratio': {
            format: value => ReportHelper.numberOrZero(value),
            sortOrder: 7,
          },
          'avg_view_drop_off': {
            format: value => ReportHelper.numberOrZero(value),
            sortOrder: 8,
          },
        }
      }
    };
  }
}
