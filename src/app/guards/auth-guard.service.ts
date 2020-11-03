import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { APIcallsService } from '../apicalls.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private apiService: APIcallsService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | import ('@angular/router').UrlTree |
  Observable<boolean | import ('@angular/router').UrlTree> | Promise<boolean | import ('@angular/router').UrlTree> {
    console.log('can activate ?');
    return this.apiService.validateToken().pipe(
      map(e => {
        if (e) {
          return true;
        } else {
          this.router.navigate(['error']);
          return false;
        }
      }),
      catchError((err) => {
        if (err.status === 200) {
          return of(true);
        }
        this.router.navigate(['error']);
        return of(false);
      })
    );
  }

}
