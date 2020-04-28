import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  backendServer = "http://localhost:3000";
  authToken;
  user;

  constructor( private http: HttpClient ) { }

  registerPlayer(player) {
    return this.http.post(this.backendServer + "/api/register", player).pipe(map(res => res));
  };

  login(player) {
    return this.http.post(this.backendServer +"/api/login", player).pipe(map(res => res));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loadToken() { this.authToken = localStorage.getItem('token'); };

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + '/api/profile', {headers: appHeaders});
  }

  loggedIn() {
    if (localStorage.getItem('token') != null) {
        return true;
    }
    return false;
  };
}
