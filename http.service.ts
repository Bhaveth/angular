import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DGS_E2E_API_URI } from 'src/app/core/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, @Inject(DGS_E2E_API_URI) private apiUrl) {}

  get<T>(path: string, params: HttpParams = new HttpParams(), applyBaseApiUrl: boolean = true): Observable<T> {
    return this.http
      .get<T>(this.getUrl(path, applyBaseApiUrl), { params })
      .pipe(catchError(this.formatErrors));
  }

  getText(path: string, params: HttpParams = new HttpParams(), applyBaseApiUrl: boolean = true): Observable<string> {
    return this.http
      .get(this.getUrl(path, applyBaseApiUrl), { params, responseType: 'text' })
      .pipe(catchError(this.formatErrors));
  }

  getBlob(
    path: string,
    responsetype: 'blob',
    applyBaseApiUrl: boolean = false,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(this.getUrl(path, applyBaseApiUrl), { observe: 'response' as 'body', responseType: responsetype, params })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body = {}, applyBaseApiUrl: boolean = true): Observable<T> {
    return this.http.put<T>(this.getUrl(path, applyBaseApiUrl), body).pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body = {}, applyBaseApiUrl: boolean = true): Observable<T> {
    return this.http.post<T>(this.getUrl(path, applyBaseApiUrl), body);
  }

  patch<T>(path: string, body = {}, applyBaseApiUrl: boolean = true): Observable<T> {
    return this.http.patch<T>(this.getUrl(path, applyBaseApiUrl), body);
  }

  postResponsText(path: string, body = {}, applyBaseApiUrl: boolean = true): Observable<any> {
    return this.http.post(this.getUrl(path, applyBaseApiUrl), body, { responseType: 'text' });
  }
  delete<T>(path: string, applyBaseApiUrl: boolean = true): Observable<T> {
    return this.http.delete<T>(this.getUrl(path, applyBaseApiUrl)).pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any): Observable<never> {
    return throwError(error.error);
  }

  getUrl = (path: string, applyBaseApiUrl: boolean): string => {
    return applyBaseApiUrl === true ? `${this.apiUrl}${path}` : `${path}`;
  };
}
