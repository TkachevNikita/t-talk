import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MicroSentryService } from '@micro-sentry/angular';
import { take } from 'rxjs';

import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notificationService: NotificationService =
    inject(NotificationService);

  private readonly sentry: MicroSentryService = inject(MicroSentryService);

  public handleError(error: any): void {
    this.sentry.report(error as Error);

    this.notificationService
      .error('Произошла ошибка', error.code)
      .pipe(take(1))
      .subscribe();
  }
}
