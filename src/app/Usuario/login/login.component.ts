import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuario:string = "";
  fUsuario!: FormGroup;
  datosCorrectos : boolean = true;
  textoError:string = "Revisa que los datos esten correctos";

  constructor(private fb: FormBuilder, private ofAuth: AngularFireAuth, private ruta : Router) {  }

  ngOnInit(): void {
    this.fUsuario = this.fb.group({
      usuario: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      contrasena : ['', Validators.required]
    })
  }

  login(){
    if( this.fUsuario.valid){
      this.ofAuth.signInWithEmailAndPassword(this.fUsuario.value.usuario, this.fUsuario.value.contrasena)
      .then((usuario) => {
        this.datosCorrectos = true;
        // this.ruta.navigateByUrl("/");
      }). catch((error) => {
        this.datosCorrectos = false;
        this.textoError = error.message;
      });
    }else{
      this.datosCorrectos = false;
      this.textoError = "Revisa que los datos esten correctos";
    }
  }

}
