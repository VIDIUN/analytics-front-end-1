import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReportDataBaseConfig, ReportDataConfig, ReportDataSection } from 'shared/services/storage-data-base.config';
import { ReportHelper } from 'shared/services';

@Injectable()
export class PathTotalsConfig extends ReportDataBaseConfig {
  constructor(_translate: TranslateService) {
    super(_translate);
  }

  public getConfig(): ReportDataConfig {
    return {
      [ReportDataSection.totals]: {
        fields: {
          'count_loads': {
            format: value => ReportHelper.integerOrZero(value),
            title: this._translate.instant(`app.entry.count_loads`),
            sortOrder: 1,
            icon: 'icon-small-impressions',
            iconColor: 'aqua',
          },
          'count_plays': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.entry.count_plays`),
            sortOrder: 2,
            icon: 'icon-small-play',
            iconColor: 'blue',
          },
          'unique_viewers': {
            format: value => ReportHelper.integerOrZero(value),
            title: this._translate.instant(`app.entry.viewers`),
            tooltip: this._translate.instant('app.entry.viewers_tt'),
            sortOrder: 3,
            icon: 'icon-small-viewer-contributor',
            iconColor: 'green',
          },
          'sum_view_period': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.entry.minutes`),
            units: value => 'min',
            sortOrder: 4,
            icon: 'icon-small-time',
            iconColor: 'orange',
          }
        }
      }
    };
  }
}
