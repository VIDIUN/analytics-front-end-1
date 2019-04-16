import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ReportDataBaseConfig, ReportDataConfig, ReportDataSection } from 'shared/services/storage-data-base.config';
import { ReportHelper } from 'shared/services';

@Injectable()
export class MiniHighlightsConfig extends ReportDataBaseConfig {
  constructor(_translate: TranslateService) {
    super(_translate);
  }
  
  public getConfig(): ReportDataConfig {
    return {
      [ReportDataSection.table]: {
        fields: {
          'name': {
            format: value => value,
            title: this._translate.instant(`app.contributors.title`),
            tooltip: this._translate.instant(`app.contributors.contributors_tt`),
            sortOrder: 1,
          },
          'count_total': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.contributors.count_total`),
            tooltip: this._translate.instant(`app.contributors.count_total`),
            sortOrder: 2,
          },
        }
      }
    };
  }
}
