import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(private http: HttpClient) { }

  get<T = any>(url: string) {
    // console.log(`Endpoint: ', ${environment.endPoint}`);
    // return this.http.get(`${environment.endPoint}${url}`).pipe(
    const ip = window.location.hostname;
    return this.http.get(`http://${ip}:9090/api/v1/${url}`).pipe(
      map(this.handleSuccess),
    ) as Observable<T>;
  }

  protected handleSuccess(res: any) {
    return res;
  }

  protected handleError(error: any) {
    return throwError(error);
  }
}
