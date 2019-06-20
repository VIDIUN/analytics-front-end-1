import { BehaviorSubject, Observable, Unsubscribable } from 'rxjs';
import { RequestFactory } from '@kaltura-ng/kaltura-common';
import { KalturaAPIException, KalturaMultiRequest, KalturaRequest } from 'kaltura-ngx-client';
import { WidgetsActivationArgs } from './widgets-manager';
import { analyticsConfig } from 'configuration/analytics-config';
import { FrameEventManagerService, FrameEvents } from 'shared/modules/frame-event-manager/frame-event-manager.service';
import { AnalyticsServerPollsBase, OnPollTickSuccess } from 'shared/services/server-polls-base.service';
import { TranslateService } from '@ngx-translate/core';

export interface WidgetState {
  polling?: boolean;
  activated?: boolean;
  error?: KalturaAPIException;
}

export abstract class WidgetBase<T = any> {
  protected _pollingSubscription: Unsubscribable;
  protected _data = new BehaviorSubject<T>(null);
  protected _state = new BehaviorSubject<WidgetState>({ polling: false, activated: false });
  protected _activationArgs: WidgetsActivationArgs;
  
  protected get _currentData(): T {
    return this._data.getValue();
  }
  
  protected get _currentState(): WidgetState {
    return this._state.getValue();
  }
  
  public data$ = this._data.asObservable();
  public state$ = this._state.asObservable();
  
  protected abstract _widgetId: string;
  
  protected abstract _pollsFactory: RequestFactory<KalturaRequest<any> | KalturaMultiRequest, T> & OnPollTickSuccess;
  
  protected abstract _onActivate(widgetsArgs: WidgetsActivationArgs, silent?: boolean): Observable<void>;
  
  protected constructor(protected _serverPolls: AnalyticsServerPollsBase,
                        protected _frameEventManager: FrameEventManagerService) {
  }
  
  protected _canStartPolling(): boolean {
    return true;
  }
  
  protected _updateState(newState: WidgetState): void {
    this._state.next({ ...this._currentState, ...newState });
  }
  
  public stopPolling(error = null): void {
    this._updateState({ polling: false, error });
    
    if (this._pollingSubscription) {
      this._pollingSubscription.unsubscribe();
      this._pollingSubscription = null;
    }
  }
  
  protected _responseMapping(responses: unknown): unknown | T {
    return responses;
  }
  
  protected _onDeactivate(): void {
    // empty by design
  }
  
  protected _hookToPolls(poll$: Observable<{ error: KalturaAPIException; result: unknown }>): Observable<{ error: KalturaAPIException; result: unknown }> {
    return poll$;
  }
  
  public startPolling(pollOnce = false): void {
    if (!this._currentState.polling && this._pollsFactory && this._canStartPolling()) {
      this._updateState({ polling: true });
  
      const poll$ = this._serverPolls.register<T>(analyticsConfig.live.pollInterval, this._pollsFactory);
      
      this._pollingSubscription = this._hookToPolls(poll$)
        .subscribe((response) => {
          this.updateLayout();

          if (response.error) {
            this.stopPolling(response.error);
            return;
          }
          
          const data = this._responseMapping(response.result) as T;
          this._data.next(data);
  
          if (typeof this._pollsFactory.onPollTickSuccess === 'function') {
            this._pollsFactory.onPollTickSuccess();
          }
          
          if (pollOnce) {
            this.stopPolling();
          }
        });
    }
  }
  
  public restartPolling(pollOnce = false): void {
    this.stopPolling();
    this.startPolling(pollOnce);
  }
  
  public activate(widgetsArgs: WidgetsActivationArgs, silent = false): void {
    if (this._currentState.activated) {
      return;
    }
    
    this._activationArgs = widgetsArgs;
    
    this._onActivate(widgetsArgs, silent)
      .subscribe(
        () => {
          this._updateState({ activated: true, error: null });
          
          if (!silent) {
            this.startPolling();
          }
        }, error => {
          this._updateState({ activated: false, error });
        });
  }
  
  public deactivate(): void {
    this._updateState({ activated: false, error: null });
    
    this.stopPolling();
    
    this._onDeactivate();
  }
  
  public retry(): void {
    this.activate(this._activationArgs);
  }
  
  public updateLayout(): void {
    if (analyticsConfig.isHosted) {
      setTimeout(() => {
        const height = document.getElementById('analyticsApp').getBoundingClientRect().height;
        this._frameEventManager.publish(FrameEvents.UpdateLayout, { height });
      }, 0);
    }
  }
}
