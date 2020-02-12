// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/switchMap';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {of} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {first, switchMap} from 'rxjs/operators';
import {AuthResponse, CsrfToken, LoginSpec, LoginStatus} from 'typings/backendapi';

import {CONFIG} from '../../../index.config';
import {K8SError} from '../../errors/errors';

import {CsrfTokenService} from './csrftoken';
import {KdStateService} from './state';

@Injectable()
export class AuthService {
  private readonly config_ = CONFIG;

  constructor(
    private readonly cookies_: CookieService,
    private readonly router_: Router,
    private readonly http_: HttpClient,
    private readonly csrfTokenService_: CsrfTokenService,
    private readonly stateService_: KdStateService,
  ) {
    this.init_();
  }

  private init_() {
    this.stateService_.onBefore.pipe(switchMap(() => this.getLoginStatus())).subscribe(status => {
      if (this.isAuthenticationEnabled(status)) {
        this.refreshToken();
      }
    });
  }

  private setTokenCookie_(token: string): void {
    // This will only work for HTTPS connection
    this.cookies_.set(this.config_.authTokenCookieName, token, null, null, null, true);
    // This will only work when accessing Dashboard at 'localhost' or
    // '127.0.0.1'
    this.cookies_.set(this.config_.authTokenCookieName, token, null, null, 'localhost');
    this.cookies_.set(this.config_.authTokenCookieName, token, null, null, '127.0.0.1');
  }

  private getTokenCookie_(): string {
    return this.cookies_.get(this.config_.authTokenCookieName) || '';
  }

  removeAuthCookies(): void {
    this.cookies_.delete(this.config_.authTokenCookieName);
    this.cookies_.delete(this.config_.skipLoginPageCookieName);
  }

  /**
   * Sends a login request to the backend with filled in login spec structure.
   */
  login(loginSpec: LoginSpec): Observable<K8SError[]> {
    return this.csrfTokenService_
      .getTokenForAction('login')
      .pipe(
        switchMap((csrfToken: CsrfToken) =>
          this.http_.post<AuthResponse>('api/v1/login', loginSpec, {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          }),
        ),
      )
      .pipe(
        switchMap((authResponse: AuthResponse) => {
          if (authResponse.jweToken.length !== 0 && authResponse.errors.length === 0) {
            this.setTokenCookie_(authResponse.jweToken);
          }

          return of(authResponse.errors);
        }),
      );
  }

  logout(): void {
    this.removeAuthCookies();
    this.router_.navigate(['login']);
  }

  /**
   * Sends a token refresh request to the backend. In case user is not logged in
   * with token nothing will happen.
   */
  refreshToken(): void {
    const token = this.getTokenCookie_();
    if (token.length === 0) return;

    this.csrfTokenService_
      .getTokenForAction('token')
      .pipe(
        switchMap(csrfToken => {
          return this.http_.post<AuthResponse>(
            'api/v1/token/refresh',
            {jweToken: token},
            {
              headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
            },
          );
        }),
      )
      .pipe(first())
      .subscribe((authResponse: AuthResponse) => {
        if (authResponse.jweToken.length !== 0 && authResponse.errors.length === 0) {
          this.setTokenCookie_(authResponse.jweToken);
          return authResponse.jweToken;
        }

        return authResponse.errors;
      });
  }

  /** Checks if user is authenticated. */
  isAuthenticated(loginStatus: LoginStatus): boolean {
    return loginStatus.headerPresent || loginStatus.tokenPresent || !this.isLoginPageEnabled();
  }

  /**
   * Checks authentication is enabled. It is enabled only on HTTPS. Can be
   * overridden by 'enable-insecure-login' flag passed to dashboard.
   */
  isAuthenticationEnabled(loginStatus: LoginStatus): boolean {
    return loginStatus.httpsMode;
  }

  getLoginStatus(): Observable<LoginStatus> {
    return this.http_.get<LoginStatus>('api/v1/login/status');
  }

  skipLoginPage(skip: boolean): void {
    this.removeAuthCookies();
    this.cookies_.set(this.config_.skipLoginPageCookieName, skip.toString());
  }

  /**
   * Returns true if user has selected to skip page, false otherwise.
   * As cookie returns string or undefined we have to check for a string match.
   * In case cookie is not set login page will also be visible.
   */
  isLoginPageEnabled(): boolean {
    return !(this.cookies_.get(this.config_.skipLoginPageCookieName) === 'true');
  }
}
