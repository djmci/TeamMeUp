import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username;
  email;
  role;
  lastLogin;
  dataRcvd:any = {};
  game;
  games;
  addedGames = [];
  attendence;

  constructor( private authService: AuthService, public toastService: ToastService) { }
  showSuccess() {
    this.toastService.show('As you viewed your Profile, we marked your attendence!', {
      classname: 'bg-success text-light',
      delay: 30000,
      autohide: true,
      headertext: 'Message from admin!'
    });
  }
  showError() {
    this.toastService.show('I am a success toast', {
      classname: 'bg-danger text-light',
      delay: 30000 ,
      autohide: true,
      headertext: 'Error!!!'
    });
  }


  addGame(){
    this.addedGames.push(this.game);
    this.authService.setGame(this.game).subscribe(data => {
      console.log(this.addedGames);
    })
    this.game = '';
  }

  addRow() {
    var table = document.getElementById("table-courts").getElementsByTagName('tbody')[0];
    var newRow   = table.insertRow();
    var newCell  = newRow.insertCell(0);
    var newText  = document.createTextNode(this.game);
    var input = document.createElement("input");
    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary"
    button.addEventListener("click", this.deleteRow);
    var span = document.createElement("span");
    span.className = "glyphicon glyphicon-minus";
    button.appendChild(span);
    input.type = "text";
    newCell.appendChild(newText);
    newCell.appendChild(input);
    newCell.appendChild(button);
  }
  deleteRow(tableRow){
    console.log(tableRow);
    var row = tableRow.parentNode;
    var idx = row.rowIndex;
    var table = row.parentNode;
    table.deleteRow(idx);
    console.log(row);

  }
  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.dataRcvd = data;
      this.username = this.dataRcvd.message.username;
      this.email = this.dataRcvd.message.email;
      this.role = this.dataRcvd.message.role;
      this.attendence = this.dataRcvd.message.attendence;
      console.log(this.dataRcvd);
    })
    this.authService.getGames().subscribe(data => {
      this.dataRcvd = data;
      this.games = this.dataRcvd.message.games;
    })
    if (this.attendence) { 
        this.showSuccess();
    }
    else this.showError();
  }

}
