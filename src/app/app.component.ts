import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  usuario!: firebase.User;
  load : boolean = true;
  constructor(public ofAuth: AngularFireAuth, private ruta : Router) {

      this.ofAuth.user.subscribe( (usuario) => {
        this.load = false;
        this.usuario = usuario!;
      });
  }
  
}
