import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  message;
  messageClass;
  username;
  email;
  role;
  lastLogin = null;
  dataRcvd;
  roleSelect = false;
  Roles = [
    'player',
    'coach',
  ];
  userRole = this.Roles[0];
  playerRanking = 0;
  opponentRanking = 0;
  games = [];
  Interests = [];
  selectSchedule = false;
  selectPlayerRanking = false;
  selectOpponentRanking = false;
  selectInterests = false;

  weekdays = [
  {"name": "Monday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Tuesday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Wednesday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Thursday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Friday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Saturday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Sunday", "status": false, "checked": 0, time: {hour: 13, minute: 30}}
  ]

  players=[];
  coaches=[];

  constructor( private authService: AuthService, private router: Router, private route: ActivatedRoute ) { }

  decodeRanking(Ranking) {
    if (Ranking == 1) {
      return 'Beginner';
    } else if (Ranking == 2) {
      return 'Medium';
    } else if (Ranking == 3) {
      return 'Advance';
    } else {
      return undefined
    }
  }

  setPlayerRanking(val) {
    this.playerRanking = val;
    console.log(val);
    this.selectPlayerRanking = true;
  }
  setOpponentRanking(val) {
    this.opponentRanking = val;
    console.log(val);
    this.selectOpponentRanking = true;
  }
  selectLevel(game, event) {
    for (let index = 0; index < this.Interests.length; index++) {
      var saveGame = this.Interests[index].split("-");
      console.log(saveGame[0]);
      if (saveGame[0] == game) {
        if (event.target.value == -1) {
          console.log("Incorrect");
        }
        var level = event.target.value;
        this.Interests[index] = saveGame[0] + "-" + level;
        console.log(this.Interests);
      }
      if (this.checkInterests()) {
        this.selectInterests = true;
      } else this.selectInterests = false;
    }
    // console.log(event);
  }
  selectGame(game) {
    // var interest:String = game
    for (let index = 0; index < this.games.length; index++) {
      if (this.games[index].name == game && this.games[index].checked == 0) {
        this.games[index].status = true;
        this.games[index].checked = 1;
        console.log(game)
        this.Interests.push(game);
      }
      else if (this.games[index].name == game && this.games[index].checked == 1) {
        this.games[index].status = false;
        this.games[index].checked = 0;
        const n = this.Interests.indexOf(game);
        if (index > -1) {
          this.Interests.splice(n, 1);
        }
      }
    }
    if (this.checkInterests()) {
      this.selectInterests = true;
    } else this.selectInterests = false;
    console.log(this.Interests);
  }
  checkInterests() {
    for (let index = 0; index < this.Interests.length; index++) {
      if (this.Interests[index].indexOf("-") == -1) {
        return false;
      }
    }
    return true;
  }

  selectDay(day) {
    for (let index = 0; index < this.weekdays.length; index++) {
      if (this.weekdays[index].name == day && this.weekdays[index].checked == 0) {
        this.weekdays[index].status = true;
        this.weekdays[index].checked = 1;
        this.selectSchedule = true;
        console.log(day)
      }
      else if (this.weekdays[index].name == day && this.weekdays[index].checked == 1) {
        this.weekdays[index].status = false;
        this.weekdays[index].checked = 0;
        if (!this.checkSchedule()) {
          this.selectSchedule = false;
        } else this.selectSchedule = true;
      }
    }
    console.log(this.weekdays)

  }

  checkSchedule() {
    for (let index = 0; index < this.weekdays.length; index++) {
      if (this.weekdays[index].checked == 1) {
        return true;
      }
    }
    return false;
  }

  saveSchedule(){
    var schdule = []
    for (let index = 0; index < this.weekdays.length; index++) {
      if(this.weekdays[index].checked == 1 && this.weekdays[index].status == true) {
        schdule.push({name: this.weekdays[index].name, time: this.weekdays[index].time})
      }
    }
    console.log(schdule);
    console.log("Interests: " + this.Interests);
    this.authService.updateScheduleInterests(schdule, this.username, this.Interests).subscribe(data => {
          this.dataRcvd = data;
          console.log(this.dataRcvd)
          if(!this.dataRcvd.success) {
              this.messageClass = 'alert alert-danger';
              this.message = this.dataRcvd.message;
          } else {
              this.messageClass = 'alert alert-success';
              this.message = this.dataRcvd.message;
              setTimeout(() => {
                this.router.navigate(['/profile']);
              }, 1000);
          }
    })
  }

  isPlayer(){
    return this.role=='player';
  }
  isCoach(){
    return this.role=='coach';
  }
  isAdmin(){
    return this.role=='admin';
  }

  deletePlayer(username){
    this.authService.deletePlayer(username).subscribe(data =>{
      // console.log(data);
      this.dataRcvd=data;
      if(!this.dataRcvd.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRcvd.message;
      } else {
          this.messageClass = 'alert alert-success';
          this.message = this.dataRcvd.message;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
      }
    });
  }

  deleteCoach(username){
    this.authService.deleteCoach(username).subscribe(data =>{
      // console.log(data);
      this.dataRcvd=data;
      if(!this.dataRcvd.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRcvd.message;
      } else {
          this.messageClass = 'alert alert-success';
          this.message = this.dataRcvd.message;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
      }
    });
  }

  createPlayer(){
    setTimeout(() => {
      this.router.navigate(['/createplayer']);
    }, 0);
  }

  createCoach(){
    setTimeout(() => {
      this.router.navigate(['/createcoach']);
    }, 0);
  }

  updatePlayer(username){
    setTimeout(() => {
      this.router.navigate(['/updateplayer', username]);
    }, 0);
  }

  updateCoach(username){
    setTimeout(() => {
      this.router.navigate(['/updatecoach', username]);
    }, 0);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.dataRcvd = data;
      console.log("Profile: ")
      console.log(this.dataRcvd);
      this.username = this.dataRcvd.message.username;
      this.email = this.dataRcvd.message.email;
      this.role = this.dataRcvd.message.role;
      if (this.role == 'player') this.lastLogin = this.dataRcvd.message.lastLogin;
      else{ // Admin or Coach
        this.authService.getPlayers().subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("No players found!");
          }else {
            for (let index = 0; index < this.dataRcvd.message.length; index++) {
              this.players.push({
                name: this.dataRcvd.message[index].name,
                username: this.dataRcvd.message[index].username,
                email: this.dataRcvd.message[index].email,
                password: this.dataRcvd.message[index].password,
                role: this.dataRcvd.message[index].role,
                opponentRanking: this.dataRcvd.message[index].opponentRanking,
                playerRanking: this.dataRcvd.message[index].playerRanking,
                Interests: this.dataRcvd.message[index].Interests,
                lastLogin: this.dataRcvd.message[index].lastLogin,
                schedule: this.dataRcvd.message[index].schedule,
                attendenceTime: this.dataRcvd.message[index].attendenceTime,
                attendenceMarked: this.dataRcvd.message[index].attendenceMarked,
                _id : this.dataRcvd.message[index]._id
              });
            }
            console.log(this.players);
          }
        });
      }
      if (this.role=='admin'){
        this.authService.getCoaches().subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("No coaches found!");
          }else {
            for (let index = 0; index < this.dataRcvd.message.length; index++) {
              this.coaches.push({
                name: this.dataRcvd.message[index].name,
                username: this.dataRcvd.message[index].username,
                email: this.dataRcvd.message[index].email,
                password: this.dataRcvd.message[index].password,
                role: this.dataRcvd.message[index].role,
                players: this.dataRcvd.message[index].players
              });
            }
            console.log(this.coaches);
          }
        });
      } else if(this.role=='coach') {
        // Get coach players
        this.authService.getCoach(this.username).subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("No players found!");
          } else {
            console.log("Coach is here");
            var l=this.players.length;
            for (let i = 0; i < l; ++i) {
              if (this.players[i]._id!=this.dataRcvd.message.players[i]){
                this.players.splice(i, 1);
                --i;
                --l;
              }
            }
            console.log("Coach players: ", this.players);
          }
        });

      }

    });
    this.authService.getGames().subscribe(data => {
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
        console.log("No games found!");
      }else {
        for (let index = 0; index < this.dataRcvd.message.length; index++) {
          this.games.push({name: this.dataRcvd.message[index].name, status: false, checked: 0});
        }
        // console.log(this.games);
      }
    });
  }

}
