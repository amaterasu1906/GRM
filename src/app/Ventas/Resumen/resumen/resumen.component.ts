import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Producto } from 'src/app/Models/producto';
import { ProductoCar } from 'src/app/Models/productosVenta';
import { ServicioProducto } from 'src/app/Models/servicio';
import { GetItemsService } from 'src/app/Services/database/get-items.service';
import { SweetalertService } from 'src/app/Services/Modales/sweetalert.service';

interface productosLista {
  TYPE: number,
  IDDB: string,
  CANTIDADITEMS: number
};

interface updateProduct{
  IDDB : string,
  UPDATE: boolean
};

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  @Input() productos : Producto[] = new Array<Producto>();
  @Input() carProductos : ProductoCar[] = new Array<ProductoCar>();
  @Input() carServicios : ServicioProducto[] = new Array<ServicioProducto>(); 
  @Input() totalPagar! : number ;

  dbItemsProductos : Producto[] = new Array<Producto>();

  updateData : Array<updateProduct> = [];
  // numeroActualizado : number = 0;
  
  constructor(private db: AngularFirestore, private getItems : GetItemsService, private modal : SweetalertService) { 
    // this.pagar();
  }

  ngOnInit(): void {
  }

  pagar(){
    let subs$ = this.getItems.valueChangeProductos().subscribe((items) => {
      this.dbItemsProductos = items;
      console.log(this.dbItemsProductos);
      
      if(this.validarDisponibilidad()){
        if(this.validarPrecios()){
          // if(this.numeroActualizado < 1){
            this.updateProductos()
            // if(){
            //   this.modal.modalSuccess("Actualizar","Se actualizo");

            // }else{
            //   this.modal.modalError("Actualizar","Error al actualizar los productos");
            // }
          // }
        }else{
          this.modal.modalError("Validar disponibilidad","Algun producto ha cambiado de precio");
        }
      }else{
        this.modal.modalError("Validar disponibilidad","Algun producto se ha agotado o hay menor cantidad disponible a la requerida");
      }
      subs$.unsubscribe();
    });
  }
  
  addVenta(){

  }
  addServicio(){

  }
  reversoVenta(){
    console.log("Aun nada");
    
  }
  finishUpdateProductos(){
      this.reversoVenta();
      localStorage.removeItem("carrito");
      this.carProductos.length = 0;
  }
  updateProductos(){
    // this.numeroActualizado++;
    this.carProductos.forEach((item) => {
      let productoUp = item.PRODUCTO;
      productoUp.CANTIDAD = productoUp.CANTIDAD - item.CANTIDADITEMS;
      console.log("Antes de actualizar");
      // Update Producto
      this.db.doc('Productos/'+item.PRODUCTO.IDDB).update(productoUp).then((result) => { 
        console.log("Update" + item.PRODUCTO.IDDB);
        this.updateData.push({
          IDDB : item.PRODUCTO.IDDB,
          UPDATE: true});
        
      }).catch(error =>{
        this.updateData.push({
          IDDB : item.PRODUCTO.IDDB,
          UPDATE: false});
      });
      console.log("ForEach 1");
      
    });
    console.log("Finalizado");
    
  }
  actualizarProducto(item: Producto){
    this.db.doc('Productos/'+item.IDDB).update(item).then((result) => {
      this.modal.modalSuccess('Actualizar producto','Producto actualizado correctamente');  
    }).catch(error =>{
      this.modal.modalError('Actualizar producto','Error al actualizar');
    });
  }

  validarPrecios(): boolean{
    let contador = 0;
    this.carProductos.forEach((item) => {
      this.dbItemsProductos.forEach((dato) => {
        if(item.PRODUCTO.PRODUCTO == dato.PRODUCTO && item.PRODUCTO.CODIGO == dato.CODIGO && item.PRODUCTO.PRECIO == dato.PRECIO){
          contador+=1;
        }
      });
    });
    return (contador == this.carProductos.length);
  }
  validarDisponibilidad() : boolean{
    let contador = 0;
    this.carProductos.forEach((item) => {
      this.dbItemsProductos.forEach((dato) => {
        if(item.PRODUCTO.PRODUCTO == dato.PRODUCTO && item.PRODUCTO.CODIGO == dato.CODIGO && item.PRODUCTO.CANTIDAD <= dato.CANTIDAD){
          contador+=1;
        }
      });
    });    
    return (contador == this.carProductos.length);
  }


}
