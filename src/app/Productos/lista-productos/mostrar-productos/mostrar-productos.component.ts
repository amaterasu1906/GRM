import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/Models/catcategoria';
import { Producto } from 'src/app/Models/producto';
import { CatalogosService } from 'src/app/Services/database/catalogos.service';

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-mostrar-productos',
  templateUrl: './mostrar-productos.component.html',
  styleUrls: ['./mostrar-productos.component.scss']
})
export class MostrarProductosComponent implements OnInit {
  producto : Producto = new Producto();
  categorias : Categoria[] = new Array<Categoria>();
  locales : Categoria[] = new Array<Categoria>();
  
  constructor(private rutaActiva: ActivatedRoute, private catalogos : CatalogosService, 
    public datepipe: DatePipe) { 
    let p = this.rutaActiva.snapshot.params.producto;
    this.producto = JSON.parse(p);

    setTimeout(()=> {
      this.categorias.forEach((categoria) => {
        if(categoria.ID == parseInt(this.producto.CATEGORIA)){
          this.producto.CATEGORIA = categoria.NOMBRE;
        }
      });
      this.locales.forEach((local) => {
        if(local.ID == this.producto.UBICACION){
          // this.producto.UBICACION = local.NOMBRE;
        }
      });
    }, 1000);

  }

  ngOnInit(): void {
    this.locales = this.catalogos.getCatCategoriaLocales();
    this.categorias = this.catalogos.getCatCategoria();
    
  }
  
}
