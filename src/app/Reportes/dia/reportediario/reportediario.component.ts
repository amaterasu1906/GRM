import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Producto } from 'src/app/Models/producto';
import { ProductoCar } from 'src/app/Models/productosVenta';
import { ServicioProducto } from 'src/app/Models/servicio';
import { Venta, VentaProducto } from 'src/app/Models/venta';
import { GetItemsService } from 'src/app/Services/database/get-items.service';

@Component({
  selector: 'app-reportediario',
  templateUrl: './reportediario.component.html',
  styleUrls: ['./reportediario.component.scss']
})
export class ReportediarioComponent implements OnInit {

  @ViewChild('ticketPrint', { static: false }) public areaImpresion!: ElementRef;
  
  productos : Producto[] = new Array<Producto>();
  ventas$! : Observable<Venta[]>;
  endDate$! : BehaviorSubject<Date>;
  ventaImpresion : Venta = new Venta();
  venta = {
    TOTALVENTA : 0,
    totalProductosVendidos : 0,
    numeroVentas : 0
  };
  carProductos : ProductoCar[] = new Array<ProductoCar>();
  carServicios : ServicioProducto[] = new Array<ServicioProducto>(); 
  fechaTicket : string = "";
  listaCarProductos : ProductoCar[] = new Array<ProductoCar>();
  listaCarServicios : ServicioProducto[] = new Array<ServicioProducto>();

  constructor(private getItemsDB: AngularFirestore, private getItems : GetItemsService) { 
    this.productos = this.getItems.getProductos();
    this.endDate$ = new BehaviorSubject(new Date(this.getDateNow()));
    this.ventas$ = this.endDate$.pipe(
      switchMap( date => this.getItemsDB.collection<Venta>('Ventas', ref =>
        ref.where('FECHAALTA', '>=', date)
      ).valueChanges())
    );
    this.loadLista();
  }

  loadLista(){
    this.fechaTicket = new Date().getTime().toString();
    const subscriptorVentas = this.ventas$.subscribe((dato)=>{
      this.listaCarProductos.length = 0;
      this.listaCarServicios.length = 0;
      this.venta.TOTALVENTA = 0;
      this.venta.totalProductosVendidos = 0;
      this.venta.numeroVentas = dato.length;

      dato.forEach( (venta) =>{
        let info = this.loadData(venta.PRODUCTOSVENDIDOS);
        let product = info[0];
        let service = info[1];
        product.forEach((x:ProductoCar) => {
          this.venta.totalProductosVendidos += x.CANTIDADITEMS;
          this.venta.TOTALVENTA += x.PRODUCTO.PRECIO*x.CANTIDADITEMS;
          this.listaCarProductos = this.addProduct(this.listaCarProductos, x);
        });
        service.forEach((x:ServicioProducto) => {
          this.venta.TOTALVENTA = this.venta.TOTALVENTA + x.PRECIO;
          this.listaCarServicios.push(x);
        });
      });
      subscriptorVentas.unsubscribe();
    });
    
  }

  addProduct(lista : ProductoCar[], producto : ProductoCar): ProductoCar[]{
    let exist : boolean = false;
    lista.forEach((item) =>{
      if(item.PRODUCTO.IDDB == producto.PRODUCTO.IDDB){
        if(item.PRODUCTO.PRECIO == producto.PRODUCTO.PRECIO){
          item.CANTIDADITEMS += producto.CANTIDADITEMS;
          exist = true;
        }
      }
    });
    if(!exist ){
      lista.push(producto);
    }
    return lista;
  }

  getDateNow(): string{
    let dateObj = new Date();
    let month = (dateObj.getUTCMonth() + 1).toString().length < 2 ? "0"+(dateObj.getUTCMonth() + 1) : (dateObj.getUTCMonth() + 1);
    let day = (dateObj.getDate()).toString().length < 2 ? "0"+(dateObj.getDate()) : dateObj.getDate();
    let year = dateObj.getUTCFullYear();
    return year+"-"+month+"-"+day+" 00:00:00";
  }
  convertirFecha(fecha: any): string{
    let f = fecha.toDate();
    return f;
  }
  ngOnInit(): void {
  }

  loadData(listaProductos: string): any[]{
    let carProduct : any[] = new Array<any>();
    let carServ : any[] = new Array<any>();
    let productosArray = JSON.parse(listaProductos);
    productosArray.forEach( (dato:VentaProducto) => {
      let encontrado : boolean = false;
      this.productos.forEach( (item : Producto) => {
        if( dato.IDPRODUCTO == item.IDDB){
          let prCar : ProductoCar = new ProductoCar();
          prCar.PRODUCTO = this.cloneProducto(item);
          prCar.PRODUCTO.PRODUCTO = dato.NOMBRE;
          prCar.PRODUCTO.PRECIO = dato.PRECIO;
          prCar.CANTIDADITEMS = dato.NUMEROITEMS;
          carProduct.push(prCar);
          encontrado = true;
        }
      });
      if( !encontrado ){
        let serCar : ServicioProducto = new ServicioProducto();
        serCar.ID = dato.IDPRODUCTO;
        serCar.NOMBRE = dato.NOMBRE;
        serCar.PRECIO = dato.PRECIO;
        carServ.push(serCar);
      }
    });
    return [carProduct, carServ];
  }
  imprimirTicket(venta: Venta){
    let info = this.loadData(venta.PRODUCTOSVENDIDOS);
    this.carProductos = info[0];
    this.carServicios = info[1];
    this.ventaImpresion = venta;
    this.fechaTicket = new Date().getTime().toString();
    setTimeout(()=>{
      this.print();
    }, 300);
  }
  print(){
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

  cloneProducto(item:Producto): Producto{
    let nuevo : Producto = new Producto();
    nuevo.IDDB = item.IDDB;
    nuevo.ID = item.ID;
    nuevo.CANTIDAD = item.CANTIDAD;
    nuevo.CATEGORIA = item.CATEGORIA;
    nuevo.CODIGO = item.CODIGO;
    nuevo.CODIGOBARRAS = item.CODIGOBARRAS;
    nuevo.DESCRIPCION = item.DESCRIPCION;
    nuevo.ESTATUS = item.ESTATUS;
    nuevo.IMGURL = item.IMGURL;
    nuevo.MARCA = item.MARCA;
    nuevo.MEDIDA = item.MEDIDA;
    nuevo.PRECIO = item.PRECIO;
    nuevo.PRODUCTO = item.PRODUCTO;
    nuevo.PROVEEDOR = item.PROVEEDOR;
    nuevo.TIPOREPUESTO = item.TIPOREPUESTO;
    nuevo.DATA1 = item.DATA1;
    nuevo.DATA2 = item.DATA2;
    nuevo.UBICACION = item.UBICACION;
    nuevo.FECHAACTUALIZACION = item.FECHAACTUALIZACION;
    nuevo.FECHAALTA = item.FECHAALTA;
    nuevo.ref = item.ref;
    return nuevo;
  }
}
