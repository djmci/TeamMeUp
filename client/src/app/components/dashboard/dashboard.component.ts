import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  constructor( private authService: AuthService, private router: Router  ) { }

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
    this.authService.updateSchedule(schdule, this.username).subscribe(data => {
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
  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.dataRcvd = data;
      this.username = this.dataRcvd.message.username;
      this.email = this.dataRcvd.message.email;
      this.role = this.dataRcvd.message.role;
      if (this.role == 'player') this.lastLogin = this.dataRcvd.message.lastLogin;
      console.log(this.dataRcvd, this.lastLogin);
    });
    this.authService.getGames().subscribe(data => {
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
        console.log("No games found!");
      }else {
        for (let index = 0; index < this.dataRcvd.message.length; index++) {
          this.games.push({name: this.dataRcvd.message[index].name, status: false, checked: 0});
        }
        console.log(this.games);
      }

    });
  }

}
