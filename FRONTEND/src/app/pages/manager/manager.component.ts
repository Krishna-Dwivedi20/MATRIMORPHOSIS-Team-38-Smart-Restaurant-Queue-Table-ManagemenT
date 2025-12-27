import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QueueService } from '../../services/queue.service';

@Component({
  standalone: true,
  selector: 'app-manager',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent {

  loading = false;

  constructor(
    private queueService: QueueService,
    private snackBar: MatSnackBar
  ) {}

  seatNextCustomer(): void {
    this.loading = true;

    this.queueService.seatCustomer({}).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackBar.open(
          res.message || 'Customer seated successfully',
          'OK',
          { duration: 4000 }
        );
      },
      error: (err) => {
        this.loading = false;
        const msg =
          err.error?.message || 'No customers to seat';
        this.snackBar.open(msg, 'Close', {
          duration: 4000
        });
      }
    });
  }
}
