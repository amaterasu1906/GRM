import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Producto } from 'src/app/Models/producto';
import { ProductoCar } from 'src/app/Models/productosVenta';
import { ServicioProducto } from 'src/app/Models/servicio';
import { Venta, VentaProducto } from 'src/app/Models/venta';
import { GetItemsService } from 'src/app/Services/database/get-items.service';
import { SweetalertService } from 'src/app/Services/Modales/sweetalert.service';
import firebase from 'firebase/app';

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
  usuario!: firebase.User;
  @Input() productos : Producto[] = new Array<Producto>();
  @Input() carProductos : ProductoCar[] = new Array<ProductoCar>();
  @Input() carServicios : ServicioProducto[] = new Array<ServicioProducto>(); 
  @Input() totalPagar! : number ;

  dbItemsProductos : Producto[] = new Array<Producto>();

  updateData : Array<updateProduct> = [];

  itemsUpdate : number = 0;
  countItemsUpdate : number = 0;
  updateExitoso : boolean = false;
  
  constructor(private db: AngularFirestore, private getItems : GetItemsService, private modal : SweetalertService,
    public ofAuth: AngularFireAuth) { 

      this.ofAuth.user.subscribe( (usuario) => {
        this.usuario = usuario!;
      });
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
            if(this.carProductos.length == 0){
              this.addServicio();
            }else{
              this.updateProductos()
            }
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
    console.log("Entrando a la venta");
    // Idventa = 20201214+time
    let venta = new Venta();
    venta.IDVENTA = '1234';
    venta.USUARIO = this.usuario.email!;
    venta.SUBTOTAL = this.totalPagar - (this.totalPagar*venta.IVA);
    venta.TOTALVENTA = this.totalPagar;
    venta.FECHAALTA = new Date();
    let ventProd : Array<any> = new Array<any>();
    this.carProductos.forEach((item) => {
      let x = this.convertProductoToVentaProduct(item);
      ventProd.push(x);
    });
    // let ventServ : Array<any> = new Array<any>();
    this.carServicios.forEach((item) => {
      let x = this.convertServicioToVentaProduct(item);
      ventProd.push(x);
    });
    console.log(JSON.stringify(ventProd));
    venta.PRODUCTOSVENDIDOS = JSON.stringify(ventProd);
    this.db.collection('Ventas').add({...venta}).then((response) => {
      console.log("Insertado correctamente");
      this.modal.modalSuccess("Venta","Se añadio correctamente la venta");
      
    }).catch(error =>{
      this.modal.modalError("Venta","Error al vender");
      // Error al insertar, se anade al localstorage
      console.log("Error al insertar venta: " + error);
    });
  }
  convertProductoToVentaProduct(producto : ProductoCar): VentaProducto{
    let vp = new VentaProducto();
    vp.IDPRODUCTO = producto.PRODUCTO.IDDB;
    vp.PRECIO = producto.PRODUCTO.PRECIO;
    vp.NUMEROITEMS = producto.CANTIDADITEMS;
    vp.NOMBRE = producto.PRODUCTO.PRODUCTO;
    return vp;
  }
  convertServicioToVentaProduct(servi : ServicioProducto): VentaProducto{
    let vp = new VentaProducto();
    vp.IDPRODUCTO = servi.ID;
    vp.PRECIO = servi.PRECIO;
    vp.NUMEROITEMS = 1;
    vp.NOMBRE = servi.NOMBRE;
    return vp;
  }
  addServicio(){
    console.log("AddServicio");
    try{
      this.carServicios.forEach((itemProducto, index) => {
        console.log("Añadiendo el servicio a DB");
        // this.db.collection('Servicio').doc().set({...itemProducto}).then((response) => {
        this.db.collection('Servicio').add({...itemProducto}).then((response) => {
          console.log("Insertado correctamente");
          console.log(response);
          
          itemProducto.ID = response.id;
          if((index+1) == this.carServicios.length){
            // si la insercion es correcta de servicios se obtienen los ID y se insertan en las ventas
            this.addVenta();
          }
        }).catch(error =>{
          // Error al insertar, se anade al localstorage
          console.log("Error al insertar servicio: " + error);
        });
        console.log("Insertado servicio:");
        console.log(this.carServicios);
      });
    }catch(error){
      console.log(error);
      
    }
    
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
    this.carProductos.forEach((item, index) => {      
      let productoUp = item.PRODUCTO;
      productoUp.CANTIDAD = productoUp.CANTIDAD - item.CANTIDADITEMS;
      // Update Producto
      this.db.doc('Productos/'+item.PRODUCTO.IDDB).update(productoUp).then((result) => { 
        this.itemsUpdate=+1;
        this.updateData.push({
          IDDB : item.PRODUCTO.IDDB,
          UPDATE: true
        });        
        if( this.itemsUpdate == this.carProductos.length ){
          this.updateExitoso = true;
        }
        if((index+1) == this.carProductos.length){
          if(this.updateExitoso){
            // si fue exitosa la actualizacion de productos, continuamos con la insercion de datos
            this.addServicio();
          }else{
            // Realizar reverso
            this.reversoVenta();
          }
        } 
      }).catch(error =>{
        this.updateData.push({
          IDDB : item.PRODUCTO.IDDB,
          UPDATE: false});
      });
          
    });
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
        if(item.PRODUCTO.PRODUCTO == dato.PRODUCTO && item.PRODUCTO.CODIGO == dato.CODIGO && item.CANTIDADITEMS <= dato.CANTIDAD){
          contador+=1;
        }
      });
    });    
    return (contador == this.carProductos.length);
  }


}
