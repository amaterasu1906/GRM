import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Categoria } from 'src/app/Models/catcategoria';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  
  constructor(private db: AngularFirestore) { }

  getCatCategoria() : Array<Categoria>{
    let categorias : Categoria[] = new Array<Categoria>();
    this.db.collection('CatCategoria').get().subscribe((result) => {
      result.docs.forEach((item) => {
        let cat = new Categoria();
        cat = item.data() as Categoria;
        cat.IDDB = item.id;
        categorias.push(cat);            
      })
    });
    return categorias;
  }
  getCatCategoriaMarcas() : Array<Categoria>{
    let categorias : Categoria[] = new Array<Categoria>();
    this.db.collection('CatMarca').get().subscribe((result) => {
      result.docs.forEach((item) => {
        let cat = new Categoria();
        cat = item.data() as Categoria;
        cat.IDDB = item.id;
        categorias.push(cat);            
      })
    });
    return categorias;
  }
  getCatCategoriaLocales() : Array<Categoria>{
    let categorias : Categoria[] = new Array<Categoria>();
    this.db.collection('CatUbicacionPieza').get().subscribe((result) => {
      result.docs.forEach((item) => {
        let cat = new Categoria();
        cat = item.data() as Categoria;
        cat.IDDB = item.id;
        categorias.push(cat);              
      })
    });
    return categorias;
  }
}
