import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { from } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ApHttpInterceptorService implements HttpInterceptor {

  constructor( private cookies: CookieService) { }

  intercept(req: import ('@angular/common/http').HttpRequest<any>, next: import ('@angular/common/http').HttpHandler)
  : import ('rxjs').Observable<import ('@angular/common/http').HttpEvent<any>> {
    // return from(this.handleAccess(request, next));
    const modifiedHeaders = req.clone({setHeaders: {Authorization: this.cookies.get('token'),
      Accept: 'application/json'}});
    return next.handle(modifiedHeaders);
  }
}
