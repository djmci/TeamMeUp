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
  game;

  constructor( private http: HttpClient ) { }

  registerPlayer(user) {
    return this.http.post(this.backendServer + "/api/register", user).pipe(map(res => res));
  };

  login(user) {
    return this.http.post(this.backendServer +"/api/login", user).pipe(map(res => res));
  }

  getPlayer() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "/api/getplayer",  {headers: appHeaders});
  }

  getGames() {
    return this.http.get(this.backendServer + "/api/gamesList").pipe(map(res => res));
  }

  setGame(game) {
    return this.http.post(this.backendServer + "/api/games", game).pipe(map(res => res));
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

  updateSchedule(schedule, username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "/api/addSchedule", {schedule, username}, {headers: appHeaders}).pipe(map(res => res));
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
