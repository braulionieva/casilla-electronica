import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {

  constructor(private ngZone: NgZone) {}

  getWindowWidth(): Observable<number> {
    return new Observable<number>(observer => {
      this.ngZone.runOutsideAngular(() => {
        observer.next(window.innerWidth);
        const resizeEvent = fromEvent(window, 'resize').pipe(
          map(() => window.innerWidth),
          startWith(window.innerWidth)
        );
        const resizeSubscription = resizeEvent.subscribe(observer);
        return () => resizeSubscription.unsubscribe();
      });
    });
  }
  
}