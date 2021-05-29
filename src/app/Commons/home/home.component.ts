import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from 'src/app/Models/producto';
import { switchMap } from 'rxjs/operators'
import { registerLocaleData } from '@angular/common';
import { Categoria } from 'src/app/Models/catcategoria';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  marcas$! : Observable<Categoria[]>;
  endDate$! : BehaviorSubject<Date>;
  constructor(private getItemsDB: AngularFirestore) {
    // console.log("Inicio");
    
    // this.endDate$ = new BehaviorSubject(new Date('2020-12-08'));
    // this.marcas$ = this.endDate$.pipe(
    //   switchMap( date => this.getItemsDB.collection<Categoria>('CatMarca', ref =>
    //     ref.where('FECHAALTA', '>=', date)
    //   ).valueChanges())
    // );
    console.log(this.prueba(9));
    
    
  }
  prueba(x: number): number
{
  let i = x - 1;
  while ((i > 0) && (x%i != 0))
      i = i - 1;
  return i;
}
  ngOnInit(): void {
    
    
  }

  nextFecha(){
    
    this.endDate$.next(moment(this.endDate$.getValue()).add(7, 'days').toDate())
  }
  previousFecha(){
    this.endDate$.next(moment(this.endDate$.getValue()).add(-7, 'days').toDate())

  }


  getProductos(): Observable<any>{
    return this.getItemsDB.collection('Productos').valueChanges();
  }

  productos(){
    this.getProductos().subscribe((response)=>{
      console.log(response);
      
    })
    
  }
  addProducto(){
    let pr: Producto = new Producto();   
    pr.CANTIDAD = 10;
    pr.CATEGORIA = "1";
    pr.CODIGO = "PONCE12";
    pr.CODIGOBARRAS = "";
    pr.DESCRIPCION = "Bujia para moto yamaha 4T";
    pr.ESTATUS = true;
    pr.FECHAACTUALIZACION = "2020-12-13T03:24:59.228Z";
    pr.FECHAALTA = "2020-12-10T03:24:36.838Z";
    pr.IMGURL = "https://firebasestorage.googleapis.com/v0/b/grmproyect-762ee.appspot.com/o/ImgProductos%2Fproducto_1607570667330.jpg?alt=media&token=4dbbd22b-711f-4b09-886d-7bd8fa529ee6";
    pr.MARCA = "Micheline2";
    pr.MEDIDA = "";
    pr.PRECIO = 30;
    pr.PRODUCTO = "Bujia2";
    pr.TIPOREPUESTO = "Bujia2";
    pr.UBICACION = 1 ;
    this.getItemsDB.collection('Productos').add(pr).then((response) => {
      console.log("Agregado" + response.id);
    }).catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }
}
