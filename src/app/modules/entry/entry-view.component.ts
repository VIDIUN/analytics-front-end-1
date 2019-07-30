import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseEntryGetAction,
  KalturaClient,
  KalturaDetachedResponseProfile,
  KalturaMediaEntry,
  KalturaMediaType,
  KalturaMetadata,
  KalturaMetadataFilter,
  KalturaMultiRequest,
  KalturaMultiResponse,
  KalturaRequestOptions,
  KalturaResponseProfileType,
  KalturaUser,
  MetadataListAction,
  UserGetAction
} from 'kaltura-ngx-client';
import { cancelOnDestroy, XmlParser } from '@kaltura-ng/kaltura-common';
import { FrameEventManagerService, FrameEvents } from 'shared/modules/frame-event-manager/frame-event-manager.service';
import { analyticsConfig } from 'configuration/analytics-config';
import { filter, map } from 'rxjs/operators';
import { AreaBlockerMessage } from '@kaltura-ng/kaltura-ui';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsManagerService } from 'shared/services';

@Component({
  selector: 'app-entry',
  templateUrl: './entry-view.component.html',
  styleUrls: ['./entry-view.component.scss'],
})
export class EntryViewComponent implements OnInit, OnDestroy {
  public _entryViewConfig = analyticsConfig.viewsConfig.entry;
  public _loadingEntry = false;
  public _blockerMessage: AreaBlockerMessage = null;
  public _entry: KalturaMediaEntry;
  public _mediaTypes = KalturaMediaType;
  public _entryId = '';
  public _owner = '';
  public _comments = 0;
  public _likes = 0;
  
  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _translate: TranslateService,
              private _kalturaClient: KalturaClient,
              private _errorsManager: ErrorsManagerService,
              private _frameEventManager: FrameEventManagerService) {
  }
  
  ngOnInit() {
    if (analyticsConfig.isHosted) {
      this._frameEventManager
        .listen(FrameEvents.UpdateFilters)
        .pipe(cancelOnDestroy(this), filter(Boolean))
        .subscribe(({ queryParams }) => {
          this._entryId = queryParams['id'];
          if (this._entryId) {
            this._loadEntryDetails();
          }
        });
    } else {
      this._route.params
        .pipe(cancelOnDestroy(this))
        .subscribe(params => {
          this._entryId = params['id'];
          if (this._entryId) {
            this._loadEntryDetails();
          }
        });
    }
    
  }
  
  ngOnDestroy() {
  }
  
  private _loadEntryDetails(): void {
    this._loadingEntry = true;
    this._blockerMessage = null;
    
    const metadataProfileId = analyticsConfig.customData.metadataProfileId;
    
    const request = new KalturaMultiRequest(
      new BaseEntryGetAction({ entryId: this._entryId })
        .setRequestOptions({
          responseProfile: new KalturaDetachedResponseProfile({
            type: KalturaResponseProfileType.includeFields,
            fields: 'id,name,mediaType,createdAt,msDuration,userId,thumbnailUrl,votes'
          })
        }),
      new UserGetAction({ userId: null })
        .setDependency(['userId', 0, 'userId'])
        .setRequestOptions(
          new KalturaRequestOptions({
            responseProfile: new KalturaDetachedResponseProfile({
              type: KalturaResponseProfileType.includeFields,
              fields: 'id,fullName'
            })
          })
        )
    );
    
    if (metadataProfileId) {
      request.requests.push(new MetadataListAction({
        filter: new KalturaMetadataFilter({
          objectIdEqual: this._entryId,
          metadataProfileIdEqual: metadataProfileId,
        })
      }));
    }
    
    this._kalturaClient
      .multiRequest(request)
      .pipe(
        cancelOnDestroy(this),
        map((responses: KalturaMultiResponse) => {
          if (responses.hasErrors()) {
            const err = responses.getFirstError();
            
            this._blockerMessage = new AreaBlockerMessage({
              title: this._translate.instant('app.common.error'),
              message: err.message,
              buttons: [{
                label: this._translate.instant('app.common.ok'),
                action: () => {
                  this._blockerMessage = null;
                  this._loadingEntry = false;
                }
              }]
            });
          }
          
          const metadataList = responses.length === 3 ? responses[2].result : null;
          const metadataItem = metadataList && metadataList.objects && metadataList.objects.length
            ? metadataList.objects[0]
            : null;
          
          return [
            responses[0].result,
            responses[1].result,
            metadataItem,
          ] as [KalturaMediaEntry, KalturaUser, KalturaMetadata];
        })
      )
      .subscribe(
        ([entry, user, metadataItem]) => {
          this._entry = entry;
          this._owner = user.fullName;
          this._likes = entry.votes;

          if (metadataItem) {
            const metadataObj = XmlParser.toJson(metadataItem.xml) as { metadata: { CommentsCount: { text: string } } };
            this._comments = metadataObj.metadata && metadataObj.metadata.CommentsCount && metadataObj.metadata.CommentsCount.text
              ? parseInt(metadataObj.metadata.CommentsCount.text, 10)
              : 0;
          }
          
          this._loadingEntry = false;
        },
        error => {
          this._loadingEntry = false;
          const actions = {
            'close': () => {
              this._blockerMessage = null;
            },
            'retry': () => {
              this._loadEntryDetails();
            }
          };
          this._blockerMessage = this._errorsManager.getErrorMessage(error, actions);
        });
  }
  
  public _back(): void {
    if (analyticsConfig.isHosted) {
      this._frameEventManager.publish(FrameEvents.EntryNavigateBack);
    } else {
      this._router.navigate(['audience/engagement'], { queryParams: this._route.snapshot.queryParams });
    }
  }
  
  public _navigateToEntry(): void {
    if (analyticsConfig.isHosted) {
      this._frameEventManager.publish(FrameEvents.NavigateTo, '/content/entries/entry/' + this._entryId);
    }
  }
}
