import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  messagePlayer;
  messageClassPlayer;
  messageCoach;
  messageClassCoach;
  onlinePlayers = [];
  onlineCoaches = [];
  dataRcvd;

  constructor(public authService: AuthService, private router: Router) { }

  createSession(game) {
    console.log(game);
    setTimeout(() => {
      this.router.navigate(['/createsession', game]);
    }, 0);
  }

  ngOnInit() {
    this.authService.getOnlinePlayers().subscribe(data => {
      console.log(data);
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
        this.messageClassPlayer = 'alert alert-danger';
        this.messagePlayer = this.dataRcvd.message;
      } else {
        this.onlinePlayers = this.dataRcvd.message;
      }
      console.log(this.onlinePlayers);
    });
    this.authService.getOnlineCoaches().subscribe(data => {
      console.log(data);
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
        this.messageClassCoach = 'alert alert-danger';
        this.messageCoach = this.dataRcvd.message;
      } else {
        this.onlineCoaches = this.dataRcvd.message;
      }
      console.log(this.onlineCoaches);
    });
  };

}
