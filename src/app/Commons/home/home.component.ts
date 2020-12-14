import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/Models/producto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  objetos! : Observable<any[]>;
  // itemColletions = AngularFirestoreCollection;
  
  constructor(private getItemsDB: AngularFirestore) {
    console.log("Inicio");
    var alovelaceDocumentRef = this.getItemsDB.collection('Productos').doc('MARCA').collection('CatMarca').doc('NOMBRE').valueChanges().subscribe((x) => {
      console.log(x);
      
    });
    console.log(alovelaceDocumentRef);
    
    // this.getItemsDB.collection('Productos').doc<any>('BvpNe1yJQYMIwkOGIjkL').valueChanges().subscribe((x) => {
    //   console.log(x);
      
    // })
    // this.getItemsDB.collection('Productos', ref => ref.where('CODIGO','==','AC1')).valueChanges().subscribe((x) => {
    //   console.log(x);
    //   let y = new Producto2();
    //   x.forEach((item) =>{
    //     console.log("x: " + item);
        
    //   })
    //   console.log();
      
      
    // })
    // let productos : Producto2[] = new Array<Producto2>();
    // this.getItemsDB.collection('Productos').get().subscribe((result) => {
    //   result.docs.forEach((item) => {
    //     let product = new Producto2();
    //     product = item.data() as Producto2;
    //     product.IDDB = item.id;
    //     product.ref = item.ref as DocumentReference;
    //     product.MARCA = item.ref as DocumentReference;
    //     productos.push(product);  
    //   })
      
    // });

    // let collectionRef = this.getItemsDB.collection('Productos');
    // let documentRefWithName = collectionRef.doc('BvpNe1yJQYMIwkOGIjkL');
    // let car = documentRefWithName.ref.path.split('/');
    // console.log(car.values());
    
    // console.log(car[1]);

    // this.pr.IDDB = "";
    
  }
  ngOnInit(): void {
    
    
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

    // let mr = new Categoria();
    // mr.ID = 1;
    // mr.NOMBRE = "Toyota";
    // mr.DESCRIPCION = "Toyota Tires";
    // mr.ESTATUS = true;
    // mr.FECHAALTA = new Date();
    // this.pr.MARCA = JSON.stringify(mr);
    console.log(pr);
    // this.getItemsDB.collection('Productos').doc('213123123').set(pr).then((response) => {
    //   console.log("Agregado");
    // })
    this.getItemsDB.collection('Productos').add(pr).then((response) => {
      console.log("Agregado" + response.id);
    }).catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }
}
