import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { AngularFirestore } from '@angular/fire/firestore';
import { GetItemsService } from 'src/app/Services/database/get-items.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Producto } from 'src/app/Models/producto';
import { Venta, VentaProducto } from 'src/app/Models/venta';
import { ProductoCar } from 'src/app/Models/productosVenta';
import { ServicioProducto } from 'src/app/Models/servicio';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  dateCustomClasses!: DatepickerDateCustomClasses[];
  myForm!: FormGroup;
  colorTheme = 'theme-red';
  today!: Date;
  maxDate!: Date;
  bsConfig!: Partial<BsDatepickerConfig>;

  productos : Producto[] = new Array<Producto>();
  listaCarProductos : ProductoCar[] = new Array<ProductoCar>();
  listaCarServicios : ServicioProducto[] = new Array<ServicioProducto>();
  ventas : Venta[] = new Array<Venta>();
  fechaTicket : string = "";

  venta = {
    totalVenta : 0,
    totalProductosVendidos : 0,
    totalServiciosVendidos : 0,
    numeroVentas : 0,
    totalProductos : 0,
    totalServicios : 0,
    diaBueno : 0,
    diaMalo : 0
  };

  constructor(private formBuilder: FormBuilder, private getItemsDB: AngularFirestore, private getItems : GetItemsService) {
    this.configuracionDatepicker();
    this.productos = this.getItems.getProductos();
  }

  busqueda(){
    let fechaIni = this.formatDate(this.myForm.value.range[0]);
    let fechaFin = this.formatDate(this.myForm.value.range[1]);
    let date1 = new Date(fechaIni);
    let date2 = new Date(fechaFin);
    date2.setDate(date2.getDate() + 1);
    this.getItemsDB.collection('Ventas', ref => ref.orderBy('FECHAALTA').startAt(date1).endAt(date2))
    .valueChanges().subscribe(data =>{
      console.log(data);
      data.forEach((item) =>{
        this.ventas.push(item as Venta);
      });
      this.loadLista();
      console.log(this.venta);
      
    });
  }

  loadLista(){
    this.fechaTicket = new Date().getTime().toString();
    this.listaCarProductos.length = 0;
    this.listaCarServicios.length = 0;
    this.venta.totalVenta = 0;
    this.venta.totalProductosVendidos = 0;
    this.venta.numeroVentas = this.ventas.length;
    this.ventas.forEach((dato, index)=>{
      let info = this.loadData(dato.PRODUCTOSVENDIDOS);
      let product = info[0];
      let service = info[1];
      let sumaProductos : number = 0;
      let sumaServicios : number = 0;
      product.forEach((x:ProductoCar) => {
        this.venta.totalVenta += x.PRODUCTO.PRECIO*x.CANTIDADITEMS;
        this.venta.totalProductosVendidos += x.CANTIDADITEMS;
        this.venta.totalProductos += x.PRODUCTO.PRECIO*x.CANTIDADITEMS;
        sumaProductos += x.PRODUCTO.PRECIO*x.CANTIDADITEMS;
        this.listaCarProductos = this.addProduct(this.listaCarProductos, x);
      });
      service.forEach((x:ServicioProducto) => {
        this.venta.totalVenta += x.PRECIO;
        this.venta.totalServiciosVendidos += 1;
        this.venta.totalServicios += x.PRECIO;
        sumaServicios += x.PRECIO;
        this.listaCarServicios.push(x);
      });
      let vendido = sumaServicios + sumaProductos;
      if(vendido > this.venta.diaBueno){
        this.venta.diaBueno = vendido;
      }
      if(index == 0 || vendido < this.venta.diaMalo){
        this.venta.diaMalo = vendido;
      }
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

  configuracionDatepicker(){
    this.today = new Date();
    this.maxDate = new Date();
    this.bsConfig = Object.assign(
      {}, 
      { containerClass: this.colorTheme },
      {dateInputFormat: 'DD-MM-YYYY',  displayOneMonthRange: true});

    this.dateCustomClasses = [
      { date: this.today, classes: ['bg-success'] }
    ];
  }
  formatDate(fecha : string): string{
    let dateObj = new Date(fecha);
    let month = (dateObj.getUTCMonth() + 1).toString().length < 2 ? "0"+(dateObj.getUTCMonth() + 1) : (dateObj.getUTCMonth() + 1);
    let day = (dateObj.getDate()).toString().length < 2 ? "0"+(dateObj.getDate()) : dateObj.getDate();
    let year = dateObj.getUTCFullYear();
    return year+"-"+month+"-"+day+" 00:00:00";
  }
  ngOnInit() {
    this.myForm = this.formBuilder.group({
      date: [''],
      range: ['', Validators.required]
    });
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
