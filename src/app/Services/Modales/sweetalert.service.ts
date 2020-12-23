import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }
  modalSuccess(titulo:string, mensaje:string){
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
  }
  modalSuccessHtml(titulo:string, mensaje:string){
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
  }

  modalError(titulo:string, mensaje: string){
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  }
  modalErrorHtml(titulo:string, mensaje: string){
    Swal.fire({
      title: titulo,
      html: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  }
  modalWarning(titulo:string, mensaje: string){
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    })
  }
}
