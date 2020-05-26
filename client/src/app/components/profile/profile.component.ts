import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalComponent } from '../form-modal/form-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public player = {
    name: "",
    username: "",
    email: "",
    role: "",
    playerRanking: "",
    opponentRanking: "",
    Interests: [],
    attendence: false,
    lastLogin: Date.now(),
    schedule: [],
    priorities: false
  }
  dataRcvd:any = {};
  game;
  games;
  addedGames = [];
  interestsTemp = [];
  prioritySubmit = false;

  constructor( private authService: AuthService, public toastService: ToastService, private modalService: NgbModal) { }
  showSuccess() {
    this.toastService.show('Your attendence is marked!', {
      classname: 'bg-success text-light',
      delay: 30000,
      autohide: true,
      headertext: 'Attendence'
    });
  }
  showError() {
    this.toastService.show('You unmarked your attendence!', {
      classname: 'bg-danger text-light',
      delay: 30000 ,
      autohide: true,
      headertext: 'Attendence'
    });
  }


  addGame(){
    this.addedGames.push(this.game);
    this.authService.setGame(this.game).subscribe(data => {
      console.log(this.addedGames);
    })
    this.game = '';
  }

  markAttendence() {
    if (!this.player.attendence) {
      this.showSuccess();
      this.player.attendence = true;
      this.authService.markAttendence(this.player.username).subscribe(data => {
        console.log("Attendence marked!");
      })
    } else {
      this.player.attendence = false;
      this.showError();
      this.authService.unMarkAttendence(this.player.username).subscribe(data => {
        console.log("Attendence unmarked!");
      })
    } 
  };

  openFormModal() {
    const modalRef = this.modalService.open(FormModalComponent);
    modalRef.componentInstance.id = 10; // should be the id

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
  pruneInterests() {
    for (let index = 0; index < this.interestsTemp.length; index++) {
      var fields = this.interestsTemp[index].split('-');
      var name = fields[0];
      var level = fields[1];
      this.player.Interests.push({name: name, level: level, priority: "Low"});
    }
    console.log(this.player.Interests);
  }

  joinInterests() {
    this.interestsTemp = []
    for (let index = 0; index < this.player.Interests.length; index++) {
      var interest = this.player.Interests[index].name + "-" + this.player.Interests[index].level + "-" + this.player.Interests[index].priority;
      this.interestsTemp.push(interest);
    }
    console.log(this.interestsTemp);
  }

  selectPriority(name, event) {
    console.log(name);
    for (let index = 0; index < this.player.Interests.length; index++) {
      if (this.player.Interests[index].name == name) {
        this.player.Interests[index].priority = event.target.value;
      }
    }
    console.log(this.player.Interests);
  }

  savePriorities() {
    this.joinInterests();
    this.authService.updatePriorities(this.interestsTemp, this.player.username).subscribe(data => {
      console.log(data);
    })
    this.prioritySubmit = true;
  }
  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.dataRcvd = data;
      this.player.username = this.dataRcvd.message.username;
      this.player.email = this.dataRcvd.message.email;
      this.player.role = this.dataRcvd.message.role;
      this.player.attendence = this.dataRcvd.message.attendenceMarked;
      this.interestsTemp = this.dataRcvd.message.Interests;
      this.pruneInterests();
      this.player.lastLogin = this.dataRcvd.message.lastLogin;
      this.player.name = this.dataRcvd.message.name;
      this.player.opponentRanking = this.dataRcvd.message.opponentRanking;
      this.player.playerRanking = this.dataRcvd.message.playerRanking;
      this.player.schedule = this.dataRcvd.message.schedule;
      this.player.priorities = this.dataRcvd.message.priorities;
      this.prioritySubmit = this.player.priorities;
      console.log(this.dataRcvd);
    })
    this.authService.getGames().subscribe(data => {
      this.dataRcvd = data;
      this.games = this.dataRcvd.message.games;
    })
  }

}
