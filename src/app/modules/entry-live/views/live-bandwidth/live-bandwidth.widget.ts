import { Observable, of as ObservableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { WidgetBase } from '../../widgets/widget-base';
import { WidgetsActivationArgs } from '../../widgets/widgets-manager';
import { LiveBandwidthRequestFactory } from './live-bandwidth-request-factory';
import { TranslateService } from '@ngx-translate/core';
import { EntryLiveGeneralPollsService } from '../../providers/entry-live-general-polls.service';

@Injectable()
export class LiveBandwidthWidget extends WidgetBase<any> {
  protected _widgetId = 'users';
  protected _pollsFactory = null;
  
  constructor(protected _serverPolls: EntryLiveGeneralPollsService,
              private _translate: TranslateService) {
    super(_serverPolls);
  }
  
  protected _onActivate(widgetsArgs: WidgetsActivationArgs): Observable<void> {
    this._pollsFactory = new LiveBandwidthRequestFactory(widgetsArgs.entryId);
    
    return ObservableOf(null);
  }
  
  public getGraphConfig(buffering: number[], bandwidth: number[]): { [key: string]: any } {
    return {
      color: ['#d48d2b', '#FBF4EB', '#e0313a', '#F4E1D9'],
      textStyle: {
        fontFamily: 'Lato',
      },
      grid: {
        top: 24, left: 0, bottom: 4, right: 0, containLabel: false
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: '#dadada',
        borderWidth: 1,
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        textStyle: {
          color: '#999999'
        },
        axisPointer: {
          animation: false
        },
        formatter: (params) => {
          const [active, engaged] = params;
          const title = active.dataIndex === 17
            ? this._translate.instant('app.entryLive.now')
            : this._translate.instant('app.entryLive.ms', [190 - ((active.dataIndex + 1) * 10)]);
          
          return `<div class="kLiveGraphTooltip"><span class="kHeader">${title}</span><div class="kUsers"><span class="kBullet" style="background-color: #d48d2b"></span>${this._translate.instant('app.entryLive.usersBuffering')}&nbsp;${active.data}%</div><div class="kUsers"><span class="kBullet" style="background-color: #e0313a"></span>${this._translate.instant('app.entryLive.downstreamBW')}&nbsp;${engaged.data} Kbps</div></div>`;
        }
      },
      xAxis: {
        boundaryGap: false,
        type: 'category',
        data: [
          this._translate.instant('app.entryLive.m180s'),
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
          this._translate.instant('app.entryLive.now')
        ],
        splitLine: {
          show: false
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
        axisLabel: {
          color: '#999999',
          padding: [8, 10, 0, 0],
        }
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'line',
          name: 'activeUsers',
          symbol: 'none',
          hoverAnimation: false,
          data: buffering,
          lineStyle: {
            color: '#d48d2b'
          },
          areaStyle: {
            color: '#FBF4EB',
          },
        },
        {
          type: 'line',
          name: 'engagedUsers',
          symbol: 'none',
          hoverAnimation: false,
          data: bandwidth,
          lineStyle: {
            color: '#e0313a'
          },
          areaStyle: {
            color: '#F4E1D9',
          },
        }
      ]
    };
  }
}