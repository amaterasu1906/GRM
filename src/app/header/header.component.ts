import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  usuario!: firebase.User;
  userName : string = "";
  constructor(private ofAuth: AngularFireAuth, private ruta : Router) { 
    if(this.ofAuth != null){
      this.ofAuth.user.subscribe( (usuario) => {
        this.usuario = usuario!;
        try {
          this.userName = this.usuario.email!;
        } catch (error) {
          console.log("UserName Undefined");
          this.userName = "?";
        }
      });

    }
  }

  ngOnInit(): void {
    
  }

  logout() {
    this.ofAuth.signOut();
    this.ruta.navigateByUrl('/');
  }

}
