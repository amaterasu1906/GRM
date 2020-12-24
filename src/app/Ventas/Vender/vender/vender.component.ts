import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/Models/catcategoria';
import { Producto } from 'src/app/Models/producto';
import { ProductoCar } from 'src/app/Models/productosVenta';
import { ServicioProducto } from 'src/app/Models/servicio';
import { CatalogosService } from 'src/app/Services/database/catalogos.service';
import { GetItemsService } from 'src/app/Services/database/get-items.service';

interface productosLista {
  TYPE: number,
  IDDB: string,
  CANTIDADITEMS: number
};

@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.scss']
})
export class VenderComponent implements OnInit {
  seccionPago :  boolean = false;

  productos : Producto[] = new Array<Producto>();
  marcas : Categoria[] = new Array<Categoria>();
  locales : Categoria[] = new Array<Categoria>();
  totalPagar : number = 0;

  carProductos : ProductoCar[] = new Array<ProductoCar>();
  carServicios : ServicioProducto[] = new Array<ServicioProducto>(); 

  formServicio! : FormGroup;

  constructor(private getItems : GetItemsService, private dbCategorias : CatalogosService,
    private fb : FormBuilder
    ) { 
    this.productos = this.getItems.getProductos();
    this.marcas = this.dbCategorias.getCatCategoriaMarcas();
    this.locales = this.dbCategorias.getCatCategoriaLocales();

    setTimeout(()=>{
      this.productos.forEach((item) => {
        this.marcas.forEach((marca) => {
          if( parseInt(item.MARCA) == marca.ID){
            item.MARCA = marca.NOMBRE;
          }
        })
      });
      this.leerLocalStorage();
      this.totalCar();
    }, 1000);
  }

  ngOnInit(): void {
    this.formServicio = this.fb.group({
      NOMBRE : ['',Validators.required],
      PRECIO:['', Validators.compose([
        Validators.required, Validators.min(1)
      ])]
    });
  }
  leerLocalStorage(){
    let car: Array<productosLista> = [];
    let s = localStorage.getItem("carrito");  
    if(s != null){
      car = JSON.parse(s);
      car.forEach((item) => {
        if(item.TYPE == 1){
          this.productos.forEach((i) => {
            if(i.IDDB == item.IDDB){
              let px : ProductoCar = new ProductoCar();
              px.PRODUCTO = i;
              px.CANTIDADITEMS = item.CANTIDADITEMS;
              this.carProductos.push(px);
            }
          });
        }
        if(item.TYPE == 2){
          let ps : ServicioProducto = new ServicioProducto();
          ps.NOMBRE = item.IDDB;
          ps.PRECIO = item.CANTIDADITEMS;
          this.carServicios.push(ps);
        }
      });
    }
  }
  almacenarLocalStorage(){
    let car: Array<productosLista> = [];
    
    this.carProductos.forEach((item) => {
      let prLista :  productosLista = {
        TYPE : 1,
        IDDB : item.PRODUCTO.IDDB,
        CANTIDADITEMS : item.CANTIDADITEMS
      }
      car.push(prLista);
    });
    this.carServicios.forEach((item) => {
      let prLista :  productosLista = {
        TYPE : 2,
        IDDB : item.NOMBRE,
        CANTIDADITEMS : item.PRECIO
      }
      car.push(prLista);
    });
    
    localStorage.setItem("carrito",JSON.stringify(car));
  }

  buscarPorNombre(evento: any){
    let nombre = evento.srcElement.value.toString().toLowerCase();
    this.productos.forEach((item) => {
      if(item.PRODUCTO.toLowerCase().includes(nombre) ||
        item.DESCRIPCION.toLowerCase().includes(nombre) ||
        item.MEDIDA.toLowerCase().includes(nombre) ||
        item.CODIGO.toLowerCase().includes(nombre) ){
        item.ESTATUS = true;
      }else{
        item.ESTATUS = false;
      }
    });
  }

  primeraLetraMayuscula(srt : string){
    if(srt.length > 0 ){
      let srt2 = srt.toLowerCase();
      return srt2.substr(0,1).toUpperCase() + srt2.slice(1);
    }
    return srt;
  }

  anadirServicioALista(){
    let serv = new ServicioProducto();
    serv = this.formServicio.value as ServicioProducto;
    this.carServicios.push(serv);
    this.totalCar();
    this.formServicio.reset();
  }

  recortarCadena(cadena:string, tam: number): string{
    return (cadena.length < 12 ) ? cadena : cadena.substr(0,tam)+'...';
  }

  anadirProductoALista(posicion : number){
    let igual : boolean = false;
    if(this.carProductos.length > 0){
      this.carProductos.forEach((item) =>{
        if( item.PRODUCTO.IDDB == this.productos[posicion].IDDB){
          let cantDisponible = this.productos[posicion].CANTIDAD;
          if(cantDisponible > item.CANTIDADITEMS){
            item.CANTIDADITEMS++; 
          }
          igual = true;
        }
      })
      if(!igual){
          let pro = new ProductoCar();
          pro.PRODUCTO = this.productos[posicion];
          pro.CANTIDADITEMS = 1;
          this.carProductos.push(pro);
      }
    }else{
      let pro = new ProductoCar();
      pro.PRODUCTO = this.productos[posicion];
      pro.CANTIDADITEMS = 1;
      this.carProductos.push(pro);
    }
    this.totalCar();
  }

  totalCar(){
    this.totalPagar = 0;
    this.carProductos.forEach((item) => {
      let precioUnidad = item.CANTIDADITEMS * item.PRODUCTO.PRECIO;
      this.totalPagar += precioUnidad;
    })
    this.carServicios.forEach((item) => {
      this.totalPagar += item.PRECIO;
    })
    this.almacenarLocalStorage();
  }

  deleteItemProductoLista(posicionProducto: number){
    this.carProductos.splice(posicionProducto,1);
    this.totalCar();
  }
  deleteItemServicioLista(posicion : number){
    this.carServicios.splice(posicion,1);
    this.totalCar();
  }
  addItemProduct(posicionProducto: number){
    let idg = this.carProductos[posicionProducto].PRODUCTO.IDDB;
    let cantDisponible = 0;
    this.productos.forEach((item) => {
      if(idg == item.IDDB){
        cantDisponible = item.CANTIDAD;
      }
    });
    if(cantDisponible > this.carProductos[posicionProducto].CANTIDADITEMS){
      this.carProductos[posicionProducto].CANTIDADITEMS++;
      this.totalCar();
    }
  }
  subItemProduct(posicionProducto: number){
    let cantDisponible = 1;
    if(cantDisponible < this.carProductos[posicionProducto].CANTIDADITEMS){
      this.carProductos[posicionProducto].CANTIDADITEMS--;
      this.totalCar();
    }
  }
  seccionPagar(){
    this.seccionPago = !this.seccionPago;
  }

  finalizo(evento: any){
    console.log(evento.total);
    this.totalPagar = evento.total;
    this.seccionPago = evento.seccionPago;
  }
}
