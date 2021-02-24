import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { AuthUserQuery } from '../state/auth-user.query';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredComponent } from '../components/session-expired/session-expired.component';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private userQuery: AuthUserQuery, private dialog: MatDialog) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(
        request.clone({
          headers: request.headers.append('Authorization', 'Bearer ' + this.userQuery.getValue().access_token)
        })
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.dialog.open<SessionExpiredComponent>(SessionExpiredComponent, null);
          }
          return throwError(error);
        })
      );
  }
}
