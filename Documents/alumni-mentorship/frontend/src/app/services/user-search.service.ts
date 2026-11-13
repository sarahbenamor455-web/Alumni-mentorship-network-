import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterOptions, SearchParams, SearchResponse } from '../models/search.model';

@Injectable({ providedIn: 'root' })
export class UserSearchService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/users';

  getFilters(): Observable<FilterOptions> {
    return this.http.get<FilterOptions>(`${this.baseUrl}/filters`);
  }

  search(params: SearchParams): Observable<SearchResponse> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<SearchResponse>(`${this.baseUrl}/search`, { params: httpParams });
  }
}