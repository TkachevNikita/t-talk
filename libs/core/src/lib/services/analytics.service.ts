import { Injectable } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private readonly analytics: Analytics) {}

  public sendEvent(eventName: string, eventParams?: Record<string, any>): void {
    logEvent(this.analytics, eventName, eventParams);
  }
}
