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

  registerCoach(user) {
    return this.http.post(this.backendServer + "/api/register", user).pipe(map(res => res));
  };

  registerAdmin(user) {
    return this.http.post(this.backendServer + "/api/register", user).pipe(map(res => res));
  };

  login(user) {
    return this.http.post(this.backendServer +"/api/login", user).pipe(map(res => res));
  }

  getPlayer(username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "/api/getplayer", {headers: appHeaders}).pipe(map(res => res));
  }

  getCoach(username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "/api/getcoach", {headers: appHeaders}).pipe(map(res => res));
  }

  getGames() {
    return this.http.get(this.backendServer + "/api/gamesList").pipe(map(res => res));
  }

  getPlayers() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "/api/playersList",  {headers: appHeaders});
  }

  getCoaches() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "/api/coachesList",  {headers: appHeaders});
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

  loadToken() {
    this.authToken = localStorage.getItem('token');
    // console.log(this.authToken);
  };

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
    var token = this.loadToken();
    console.log(token);
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

  deletePlayer(username){
    var token = this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + '/api/deletePlayer', {username}, {headers: appHeaders}).pipe(map(res => res));
  }

  deleteCoach(username){
    var token = this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + '/api/deleteCoach', {username}, {headers: appHeaders}).pipe(map(res => res));
  }

  updateCoach(coach) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "/api/updateCoach", {coach}, {headers: appHeaders}).pipe(map(res => res));
  };

  updatePlayer(player) {
    console.log(player);
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "/api/updatePlayer", {player}, {headers: appHeaders}).pipe(map(res => res));
  };
}
