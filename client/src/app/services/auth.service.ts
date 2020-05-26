import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';


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
    this.updateStatus();
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loadToken() { this.authToken = localStorage.getItem('token'); };

  updateStatus() {
    var username = this.user.username;
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    console.log(username, appHeaders);
    setTimeout(() => {
      console.log(username);
    }, 2000 )
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  markAttendence(username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "/api/markattendence", {username}, {headers: appHeaders}).pipe(map(res => res));
  }

  unMarkAttendence(username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "/api/unmarkattendence", {username}, {headers: appHeaders}).pipe(map(res => res));
  }

  updateSchedule(schedule, username, Interests) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    console.log(Interests);
    return this.http.post(this.backendServer + "/api/addSchedule", {schedule, username, Interests}, {headers: appHeaders}).pipe(map(res => res));
  }

  updatePriorities(priorities, username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "/api/updatepriorities", {priorities, username}, {headers: appHeaders}).pipe(map(res => res));
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
