import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _sidebarVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get sidebarVisible$(): Observable<boolean> {
    return this._sidebarVisible.asObservable();
  }

  toggleSidebar(): void {
    this._sidebarVisible.next(!this._sidebarVisible.value);
  }
}
