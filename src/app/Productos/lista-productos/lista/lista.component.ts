import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/Models/catcategoria';
import { Producto } from 'src/app/Models/producto';
import { CatalogosService } from 'src/app/Services/database/catalogos.service';
import { GetItemsService } from 'src/app/Services/database/get-items.service';
import { SweetalertService } from 'src/app/Services/Modales/sweetalert.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
  productos : Producto[] = new Array<Producto>();
  marcas : Categoria[] = new Array<Categoria>();
  locales : Categoria[] = new Array<Categoria>();

  constructor(private getItems : GetItemsService, private dbCategorias : CatalogosService, 
    private ruta : Router, private db: AngularFirestore, private modal : SweetalertService) { 
    
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
    }, 1000);
    
  }

  ngOnInit(): void {
  }

  pasarParametro(item: Producto){
    item.ref = null!;
    this.ruta.navigate(['productos/productos', {producto : JSON.stringify(item)}]);
  }

  actualizarProducto(item: Producto){
    item.FECHAACTUALIZACION = new Date().toISOString();
    this.db.doc('Productos/'+item.IDDB).update(item).then((result) => {
      this.modal.modalSuccess('Actualizar producto','Producto actualizado correctamente');  
    }).catch(error =>{
      this.modal.modalError('Actualizar producto','Error al actualizar');
    });
  }

  updateItemCantidad(posicion: number, evento : any){
    let cantidadUpdate = evento.srcElement.value;
    if(cantidadUpdate >= 1){
      this.productos[posicion].CANTIDAD = cantidadUpdate;
    }
  }

  updateItemPrecio(posicion: number, evento : any){
    let precioUpdate = evento.srcElement.value;
    if(precioUpdate > 0.1){
      this.productos[posicion].PRECIO = precioUpdate;
    }
  }

  agregarProducto(){
    this.ruta.navigateByUrl('/productos/agregar');
  }
  cargarExcel(){
    this.ruta.navigateByUrl('/read-excel');
  }

  cambiarLocal(posicion: number, event : any){
    let localUpdate = event.srcElement.value;
    this.productos[posicion].UBICACION = localUpdate;
  }

  buscarPorNombre(evento: any){
    let nombre = evento.srcElement.value.toString().toLowerCase();
    this.productos.forEach((item) => {
      if( item.MEDIDA == undefined){
        item.MEDIDA = "";
      }
      if(
        item.PRODUCTO.toLowerCase().includes(nombre) ||
        item.DESCRIPCION.toLowerCase().includes(nombre) ||
        item.MEDIDA.toLowerCase().includes(nombre) ||
        item.CODIGO.toLowerCase().includes(nombre) 
      ){
        item.ESTATUS = true;
      }else{
        item.ESTATUS = false;
      }
    })

  }
}
