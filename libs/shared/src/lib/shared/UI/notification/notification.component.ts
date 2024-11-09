import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiPopover } from '@taiga-ui/cdk';
import { TuiAlertOptions } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import { IAlertData } from '../../interfaces/alert-data.interface';

@Component({
  standalone: true,
  selector: 'lib-shared-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  protected readonly context =
    injectContext<TuiPopover<TuiAlertOptions<void>, boolean>>();

  protected dialogData: IAlertData = this.context.data as unknown as IAlertData;
}
