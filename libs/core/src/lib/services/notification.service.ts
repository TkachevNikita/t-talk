import { inject, Injectable, INJECTOR } from '@angular/core';
import { NotificationComponent } from '@t-talk/shared';
import { TuiAlertService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly alerts = inject(TuiAlertService);
  private readonly injector = inject(INJECTOR);

  public success(title: string, text: string): Observable<void> {
    return this.openDialog(title, text, 'positive');
  }

  public error(title: string, text: string): Observable<void> {
    return this.openDialog(title, text, 'negative');
  }

  public info(title: string, text: string): Observable<void> {
    return this.openDialog(title, text, 'info');
  }

  public warning(title: string, text: string): Observable<void> {
    return this.openDialog(title, text, 'warning');
  }

  private openDialog(
    title: string,
    text: string,
    status: string,
  ): Observable<void> {
    return this.alerts.open(
      new PolymorpheusComponent(NotificationComponent, this.injector),
      {
        label: title,
        appearance: status,
        data: {
          body: text,
        },
      },
    );
  }
}
