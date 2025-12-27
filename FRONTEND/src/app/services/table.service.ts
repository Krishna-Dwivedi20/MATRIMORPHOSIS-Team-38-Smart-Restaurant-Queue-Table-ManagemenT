import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private baseUrl = environment.apiBaseUrl + '/api/tables';

  constructor(private http: HttpClient) {}

  // GET /api/tables
  getAllTables(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // POST /api/tables
  createTable(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  // PUT /api/tables/:id/status
  updateTableStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/${id}/status`,
      { status }
    );
  }

  // POST /api/tables/reserve
  reserveTable(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/reserve`,
      data
    );
  }

  // PUT /api/tables/:table_id/cancel
  cancelReservation(tableId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/${tableId}/cancel`,
      {}
    );
  }
}
