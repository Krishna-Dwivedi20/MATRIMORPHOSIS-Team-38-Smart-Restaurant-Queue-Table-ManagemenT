import { Component, OnInit } from '@angular/core';
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
export class QueueComponent implements OnInit {

  loading = false;
  queueList: any[] = [];

  constructor(
    private queueService: QueueService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchQueueList();
  }

  fetchQueueList(): void {
    this.loading = true;
    this.queueService.getQueue().subscribe({
      next: (res: any) => {
        this.queueList = res.data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load queue', err);
        this.loading = false;
        this.queueList = [];
      }
    });
  }

  openJoinDialog(): void {
    this.joinQueue();
  }

  joinQueue(): void {
    this.loading = true;
    const payload = {
      user_id: 1,
      party_size: 4
    };

    this.queueService.joinQueue(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackBar.open('Successfully added to queue!', 'OK', { duration: 3000 });
        this.fetchQueueList();
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err.error?.message || 'Failed to join queue';
        this.snackBar.open(msg, 'Close', { duration: 3000 });
      }
    });
  }

  callCustomer(item: any): void {
    this.snackBar.open(`Called ${item.customer_name || 'Guest'}`, 'OK', { duration: 2000 });
  }

  getTotalQueueCount(): number {
    return this.queueList.length;
  }

  getAvailableTables(): number {
    return Math.max(0, 6 - this.queueList.length);
  }

  getAverageWaitTime(): number {
    if (this.queueList.length === 0) return 0;
    const total = this.queueList.reduce((sum, item) => sum + this.getWaitTime(item.joined_at), 0);
    return Math.round(total / this.queueList.length);
  }

  getWaitTime(joinedAt: string): number {
    if (!joinedAt) return 0;
    const joinTime = new Date(joinedAt).getTime();
    const now = new Date().getTime();
    return Math.round((now - joinTime) / 60000);
  }
}
