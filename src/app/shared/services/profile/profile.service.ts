import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  usernameSubject: Subject<string> = new Subject<string>();
  userPicSubject: Subject<string> = new Subject<string>();

  setUsername(username: string) {
    this.usernameSubject.next(username);
  }
  setUserPic(userPic: string) {
    this.userPicSubject.next(userPic);
  }

  constructor() {}
}
