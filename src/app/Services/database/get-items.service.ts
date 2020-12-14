import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/Models/producto';

@Injectable({
  providedIn: 'root'
})
export class GetItemsService {

  constructor(private db: AngularFirestore) { }

  getProductos() : Array<Producto>{
    let productos : Producto[] = new Array<Producto>();
    this.db.collection('Productos').get().subscribe((result) => {
      result.docs.forEach((item) => {
        let product = new Producto();
        product = item.data() as Producto;
        product.IDDB = item.id;
        product.ref = item.ref as DocumentReference;
        productos.push(product);      
      })
    });
    return productos;
  }
  valueChangeProductos() : Observable <any[]>{
    return this.db.collection('Productos').valueChanges();
  }
  
}
