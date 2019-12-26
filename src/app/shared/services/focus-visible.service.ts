import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class FocusVisibleService implements OnDestroy {

  private initialized = false;
  public lastTrigger = null;
  
  constructor() {
    this.init();
  }
  
  private init(): void {
    if (!this.initialized) {
      this.initialized = true;
      document.addEventListener('keydown', this.documentKeydownListener.bind(this), true);
      document.addEventListener('mousedown', this.documentMousedownListener.bind(this), true);
    }
  }
  
  private documentKeydownListener(): void {
    this.lastTrigger = 'keyboard';
  }
  private documentMousedownListener(): void {
    this.lastTrigger = 'mouse';
  }
  
  ngOnDestroy() {
    document.removeEventListener('keydown', this.documentKeydownListener.bind(this), true);
    document.removeEventListener('mousedown', this.documentMousedownListener.bind(this), true);
  }

}

