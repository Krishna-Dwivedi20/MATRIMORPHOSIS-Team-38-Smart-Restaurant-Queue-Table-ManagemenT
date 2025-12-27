import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TableService } from '../../services/table.service';

@Component({
  standalone: true,
  selector: 'app-tables',
  imports: [CommonModule, MatCardModule],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {

  tables: any[] = [];
  loading = true;

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.fetchTables();
  }

  fetchTables(): void {
    this.tableService.getAllTables().subscribe({
      next: (data) => {
        this.tables = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tables', err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'available';
      case 'RESERVED': return 'reserved';
      case 'OCCUPIED': return 'occupied';
      default: return '';
    }
  }
}
