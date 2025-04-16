import { InboxComponent } from './inbox/inbox.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { IndexComponent } from './index/index.component';
import { NotificationComponent } from './notification/notification.component';
import { Routes } from '@angular/router';
import { InboxTableComponent } from './inbox-table/inbox-table.component';
import { NoEncontradoComponent } from '../no-encontrado/no-encontrado.component';
import { notificationInboxGuard } from '../guard/notification-inbox.guard';

export const routes: Routes = [
  {
    path: '', component: IndexComponent,
    children: [
      { path: '', redirectTo: 'inbox', pathMatch: 'full' },
      { path: 'inbox', component: InboxComponent },
      { path: 'my-account', component: MyAccountComponent },
      { path: `my-notification/:id`, component: NotificationComponent },
      { path: `notification/folder/0`, redirectTo: `inbox`, pathMatch: 'full' },
      { path: `notification`, children: [
        { path: `:type/:id`, component: InboxTableComponent, canActivate: [notificationInboxGuard] },
      ]},
      { path: 'no-encontrado', component: NoEncontradoComponent, data: { redirect: '/app/inbox' } },
    ],
  },

];

