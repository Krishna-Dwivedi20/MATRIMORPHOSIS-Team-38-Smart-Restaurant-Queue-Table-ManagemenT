import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TablesComponent } from './pages/tables/tables.component';
import { QueueComponent } from './pages/queue/queue.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ManagerComponent } from './pages/manager/manager.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'queue', component: QueueComponent },
  { path: 'reserve', component: ReservationComponent },
  { path: 'manager', component: ManagerComponent },
  { path: '**', redirectTo: '' }
];
