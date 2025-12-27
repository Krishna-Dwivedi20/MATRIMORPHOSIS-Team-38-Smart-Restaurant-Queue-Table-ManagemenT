import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QueueService } from '../../services/queue.service';

@Component({
  standalone: true,
  selector: 'app-queue',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent {

  loading = false;

  constructor(
    private queueService: QueueService,
    private snackBar: MatSnackBar
  ) {}

  joinQueue(): void {
    this.loading = true;

    const payload = {
      user_id: 1
    };

    this.queueService.joinQueue(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackBar.open(res.message, 'OK', {
          duration: 4000
        });
      },
      error: (err) => {
        this.loading = false;
        const msg =
          err.error?.message || 'Failed to join queue';

        this.snackBar.open(msg, 'Close', {
          duration: 4000
        });
      }
    });
  }
}
