import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { UserSearchService } from '../../services/user-search.service';
import { FilterOptions, MentorUser, Pagination } from '../../models/search.model';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(UserSearchService);
  private destroyRef = inject(DestroyRef);

  // ---- State (signals) ----
  filters = signal<FilterOptions>({ roles: [], industries: [], days: [], timeSlots: [] });
  results = signal<MentorUser[]>([]);
  pagination = signal<Pagination>({ page: 1, limit: 6, total: 0, totalPages: 1 });
  loading = signal(false);
  error = signal('');

  // ---- Search form ----
  form = this.fb.nonNullable.group({
    q: '',
    role: '',
    industry: '',
    day: '',
    timeSlot: '',
    sort: 'relevance',
    limit: 6
  });

  private currentPage = 1;
  private trigger$ = new Subject<void>();

  pageNumbers = computed(() => {
    const { page, totalPages } = this.pagination();
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  });

  ngOnInit(): void {
    this.service.getFilters().subscribe({
      next: f => this.filters.set(f),
      error: () => this.error.set('Could not load filter options.')
    });

    this.trigger$
      .pipe(
        tap(() => { this.loading.set(true); this.error.set(''); }),
        switchMap(() =>
          this.service
            .search({ ...this.form.getRawValue(), page: this.currentPage })
            .pipe(catchError(() => {
              this.error.set('Search failed. Is the backend running?');
              return of(null);
            }))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.loading.set(false);
        if (res) {
          this.results.set(res.data);
          this.pagination.set(res.pagination);
        }
      });

    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentPage = 1;
        this.trigger$.next();
      });

    this.trigger$.next();
  }

  goToPage(page: number): void {
    const { totalPages } = this.pagination();
    if (page < 1 || page > totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.trigger$.next();
  }

  resetFilters(): void {
    this.form.reset({ q: '', role: '', industry: '', day: '', timeSlot: '', sort: 'relevance', limit: 6 });
  }
}