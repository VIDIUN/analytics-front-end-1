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
      [ReportDataSection.totals]: {
        fields: {
	/*'count_total': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.contributors.added_entries`),
            tooltip: this._translate.instant(`app.contributors.added_entries`),
            sortOrder: 2,
	    },*/
          'count_video': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.contributors.added_videos`),
            tooltip: this._translate.instant(`app.contributors.added_videos`),
            sortOrder: 2,
          },
          'count_audio': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.contributors.added_audio`),
            tooltip: this._translate.instant(`app.contributors.added_audio`),
            sortOrder: 2,
          },
          'count_image': {
            format: value => ReportHelper.numberOrZero(value),
            title: this._translate.instant(`app.contributors.added_images`),
            tooltip: this._translate.instant(`app.contributors.added_images`),
            sortOrder: 2,
          },
        }
      }
    };
  }
}
