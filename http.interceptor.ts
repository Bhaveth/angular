import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(
        request.clone({
          headers: request.headers
            .append('Cache-Control', 'no-cache')
            .append('Pragma', 'no-cache')
        })
      )
      .pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = ``;
          if (error.status === 400) {
            if (error.error instanceof Array) {
              errorMessage = this.showValidationsArray(error.error);
            } else if (error.error instanceof Object) {
              errorMessage = this.showValidationsObject(error.error);
            } else if (!!error.error.message) {
              errorMessage = error.error.message;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
            else {
              errorMessage = 'Invalid request';
            }
          } else if (error.status === 500) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
            else {
              errorMessage = 'Invalid request';
            }
          }

          if (errorMessage) {
            this.toastr.error(errorMessage);
          }
          return throwError(error);
        })
      );
  }

  private showValidationsArray(validationData: any[], errorMessage?): string {
    errorMessage = errorMessage || '';
    validationData.forEach(error => {
      if (typeof error === 'string') {
        errorMessage = `${errorMessage}${error}\n`;
      }
    });
    return errorMessage;
  }

  private showValidationsObject(validationData: object, errorMessage?): string {
    const propertyNames = Object.keys(validationData);
    errorMessage = errorMessage || '';
    propertyNames.forEach(property => {
      const result = validationData[property];
      if (result instanceof Array) {
        errorMessage = this.showValidationsArray(result, errorMessage);
      } else if (typeof result === 'string') {
        errorMessage = `${errorMessage}${result}\n`;
      }
    });
    return errorMessage;
  }
}
