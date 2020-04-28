import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username;
  email;
  dataRcvd:any = {};

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.dataRcvd = data;
      this.username = this.dataRcvd.message.username;
      this.email = this.dataRcvd.message.email;
      console.log(this.dataRcvd);
    })

  }

}
