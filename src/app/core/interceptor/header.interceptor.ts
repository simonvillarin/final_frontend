import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.excludeToken(request.url)) {
      return next.handle(request);
    }

    const token = this.authService.getToken();

    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(modifiedRequest);
  }

  excludeToken(url: string): boolean {
    const excludedUrls: string[] = [
      'http://localhost:8080/api/auth/register',
      'http://localhost:8080/api/auth/login',
      'http://localhost:8080/api/farming/email/send',
      'http://localhost:8080/api/farming/email/check',
      'http://localhost:8080/api/farming/email/expired',
      'http://localhost:8080/api/farming/email/otp',
      'http://localhost:8080/api/farming/email/userId',
      'http://localhost:8080/api/farming/email/user/',
    ];
    return excludedUrls.some((excludedUrl) => url.includes(excludedUrl));
  }
}
