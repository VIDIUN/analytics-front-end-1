import { Component, EventEmitter, Output } from '@angular/core';
import { DateRange, DateRangeServerValue, FiltersService, TimeInterval } from './filters.service';
import { SelectItem } from 'primeng/api';
import { KalturaReportInterval } from 'kaltura-ngx-client';
import { DateChangeEvent } from '../time-selector/time-selector.service';

export interface DateFiltersChangedEvent {
  dateRange: DateRange;
  dateRangeServerValue: DateRangeServerValue;
  timeInterval: TimeInterval;
  timeIntervalServerValue: KalturaReportInterval;
  initialRun: boolean;
  isPresetMode: boolean;
  startDate: number;
  endDate: number;
  rangeLabel: string;
}

@Component({
  selector: 'app-live-discovery-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Output() filtersChanged = new EventEmitter<DateFiltersChangedEvent>();
  
  private _initialRun = true;
  private _isPresetMode = true;
  private _startDate: number;
  private _endDate: number;
  private _daysCount: number = null;
  private _rangeLabel: string;
  
  public _timeIntervalOptions: SelectItem[];
  public _selectedTimeInterval: TimeInterval;
  public _selectedDateRange = DateRange.LastMin;
  
  constructor(private _filterService: FiltersService) {
  }
  
  private _updateInterval(selected = null): void {
    this._timeIntervalOptions = this._filterService.getTimeIntervalList(this._selectedDateRange, this._daysCount);
    
    this._selectedTimeInterval = selected && !this._timeIntervalOptions.find(({ value }) => value === selected).disabled
      ? selected
      : this._timeIntervalOptions.find(({ disabled }) => !disabled).value; // find first enabled option
  }
  
  public _onFilterChange(firstRun = false, timeInterval = this._selectedTimeInterval): void {
    this._updateInterval(timeInterval);
    
    this.filtersChanged.emit({
      initialRun: firstRun,
      dateRange: this._selectedDateRange,
      dateRangeServerValue: this._filterService.getDateRangeServerValue(this._selectedDateRange),
      timeInterval: this._selectedTimeInterval,
      timeIntervalServerValue: this._filterService.getTimeIntervalServerValue(this._selectedTimeInterval),
      isPresetMode: this._isPresetMode,
      startDate: this._startDate,
      endDate: this._endDate,
      rangeLabel: this._rangeLabel,
    });
  }
  
  public _onDateFilterChange(event: DateChangeEvent): void {
    this._isPresetMode = event.isPresetMode;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._selectedDateRange = event.dateRange;
    this._daysCount = event.daysCount;
    this._rangeLabel = event.rangeLabel;
    
    this._onFilterChange(this._initialRun, null);
    this._initialRun = false;
  }
}
