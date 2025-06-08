import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userDataSubject = new BehaviorSubject<any>(null);
  private userSesionSubject = new BehaviorSubject<any>(null);

  userData$ = this.userDataSubject.asObservable();
  userSesion$ = this.userSesionSubject.asObservable();

  constructor() { }
  setUserData(data: any): void {
    this.userDataSubject.next(data);
    localStorage.setItem('userData', JSON.stringify(data));
  }

  setCurrentSesion(data: any): void {
    this.userSesionSubject.next(data);
    localStorage.setItem('currentSession', JSON.stringify(data));
  }

  getUserData(){
    return this.userDataSubject.value;
  }

  getCurrentSesion(){
    return this.userSesionSubject.value;
  }

  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
