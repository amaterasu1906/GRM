import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @ViewChild('ticketPrint', { static: false }) public areaImpresion!: ElementRef;
  @Input() productos : Producto[] = new Array<Producto>();
  @Input() carProductos : ProductoCar[] = new Array<ProductoCar>();
  @Input() carServicios : ServicioProducto[] = new Array<ServicioProducto>(); 
  @Input() totalPagar! : number ;
  @Output() finalizado = new EventEmitter(); 
  dbItemsProductos : Producto[] = new Array<Producto>();
  updateData : Array<updateProduct> = [];
  itemsUpdate : number = 0;
  countItemsUpdate : number = 0;
  updateExitoso : boolean = false;
  fechaTicket : string = "";
  vistaTicket : boolean = false;
  cloneCarProductos : ProductoCar[] = new Array<ProductoCar>();
  cloneCarServicios : ServicioProducto[] = new Array<ServicioProducto>(); 
  ventaImpresion : Venta = new Venta();

  constructor(private db: AngularFirestore, private getItems : GetItemsService, private modal : SweetalertService,
    public ofAuth: AngularFireAuth) { 

      this.ofAuth.user.subscribe( (usuario) => {
        this.usuario = usuario!;
      });
  }

  ngOnInit(): void {
  }

  imprimirTicket(){
    var width  = screen.width-400;
    var height = screen.height - 200;
    var left   = screen.width-Math.round(screen.width/2 + width/2);
    var top    = 0;
    var params = 'width='+width+', height='+height;
    params += ', top='+top+', left='+left;
    let printContents = this.areaImpresion.nativeElement.innerHTML;
    let popupWin = window.open('', '_blank', params);
    if( popupWin != null){
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Ticket</title>
            <link rel="stylesheet" href="/assets/css/styleTicket.css" >
          </head>
          <body>${printContents}</body>
        </html>`
      );
      popupWin.document.close();
    }
  }

  pagar(){
    let subs$ = this.getItems.valueChangeProductos().subscribe((items) => {
      this.dbItemsProductos = items;
      console.log(this.dbItemsProductos);
      if(this.carProductos.length != 0){
        if(this.validarDisponibilidad()){
          if(this.validarPrecios()){
            this.updateProductos();
          }else{
            this.modal.modalError("Validar disponibilidad","Algun producto ha cambiado de precio");
          }
        }else{
          this.modal.modalError("Validar disponibilidad","Algun producto se ha agotado o hay menor cantidad disponible a la requerida");
        }
      }else if(this.carServicios.length != 0){
        this.addServicio();
      }else{
        this.modal.modalError("Carrito vacio","No hay productos o servicios");
      }
      subs$.unsubscribe();
    });
  }
  getIdVenta(): string{
    let dateObj = new Date();
    let month = (dateObj.getUTCMonth() + 1).toString().length < 2 ? "0"+(dateObj.getUTCMonth() + 1) : (dateObj.getUTCMonth() + 1);
    let day = (dateObj.getUTCDate()).toString().length < 2 ? "0"+(dateObj.getUTCDate()) : dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let hour = (dateObj.getHours()).toString().length < 2 ? "0"+(dateObj.getHours()) : dateObj.getHours();
    let minutes = (dateObj.getUTCMinutes()).toString().length < 2 ? "0"+(dateObj.getUTCMinutes()) : dateObj.getUTCMinutes()
    let seconds = (dateObj.getUTCSeconds()).toString().length < 2 ? "0"+(dateObj.getUTCSeconds()) : dateObj.getUTCSeconds()
    return year+""+month+""+day+""+hour+""+minutes+""+seconds;
  }
  addVenta(){
    
    this.ventaImpresion.IDVENTA = this.getIdVenta();
    this.ventaImpresion.USUARIO = this.usuario.email!;
    this.ventaImpresion.SUBTOTAL = this.totalPagar - (this.totalPagar*this.ventaImpresion.IVA);
    this.ventaImpresion.TOTALVENTA = this.totalPagar;
    this.ventaImpresion.FECHAALTA = new Date();
    let ventProd : Array<any> = new Array<any>();
    this.carProductos.forEach((item) => {
      let x = this.convertProductoToVentaProduct(item);
      ventProd.push(x);
    });
    this.carServicios.forEach((item) => {
      let x = this.convertServicioToVentaProduct(item);
      ventProd.push(x);
    });
    this.ventaImpresion.PRODUCTOSVENDIDOS = JSON.stringify(ventProd);
    this.db.collection('Ventas').add({...this.ventaImpresion}).then((response) => {
      this.modal.modalSuccess("Venta","Se añadio correctamente la venta");
      this.fechaTicket = new Date().getTime().toString();
      this.finishUpdateProductos();
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
    try{
      this.carServicios.forEach((itemProducto, index) => {
        this.db.collection('Servicio').add({...itemProducto}).then((response) => {
          itemProducto.ID = response.id;
          if((index+1) == this.carServicios.length){
            // si la insercion es correcta de servicios se obtienen los ID y se insertan en las ventas
            this.addVenta();
          }
        }).catch(error =>{
          // Error al insertar, se anade al localstorage
          console.log("Error al insertar servicio: " + error);
        });
      });
    }catch(error){
      console.log(error);
    }
  }
  reversoVenta(){
    console.log("Aun nada");
    
  }
  clonar(a:any[], b:any[]): any[]{
    a.forEach(item => b.push(item));
    return b;
  }
  finishUpdateProductos(){
    this.cloneCarProductos = this.clonar(this.carProductos, this.cloneCarProductos);
    this.cloneCarServicios = this.clonar(this.carServicios, this.cloneCarServicios);
    this.ventaImpresion.TOTALVENTA = this.totalPagar;
      localStorage.removeItem("carrito");
      this.carProductos.length = 0;
      this.carServicios.length = 0;
      this.finalizado.emit({total:0, seccionPago: true})
      this.vistaTicket = true;
    }
  finalizar(){
    this.finalizado.emit({total:0, seccionPago: false})
  }
  updateProductos(){
    this.carProductos.forEach((item, index) => {      
      let productoUp = item.PRODUCTO;
      productoUp.CANTIDAD = productoUp.CANTIDAD - item.CANTIDADITEMS;
      // Update Producto
      this.db.doc('Productos/'+item.PRODUCTO.IDDB).update(productoUp).then((result) => {
        this.itemsUpdate=this.itemsUpdate+1;
        if( this.itemsUpdate == this.carProductos.length ){ 
          this.updateExitoso = true; 
        }
        this.updateData.push({
          IDDB : item.PRODUCTO.IDDB,
          UPDATE: true
        });
        if((index+1) == this.carProductos.length){
          if(this.updateExitoso){
            // si fue exitosa la actualizacion de productos, continuamos con la insercion de datos
            if(this.carServicios.length == 0){ this.addVenta();}
            else{ this.addServicio(); }
          }else{this.reversoVenta();
          }
        } 
      }).catch(error =>{
        console.log("error: " + error);
        
        this.updateData.push({
          IDDB : item.PRODUCTO.IDDB,
          UPDATE: false});
      });
          
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
