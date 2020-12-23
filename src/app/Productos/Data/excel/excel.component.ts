import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/Models/producto';
import { GetItemsService } from 'src/app/Services/database/get-items.service';
import { SweetalertService } from 'src/app/Services/Modales/sweetalert.service';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss']
})
export class ExcelComponent implements OnInit {
  arrayBuffer:any;
  file!:File;
  dataJSON : Producto[] = new Array<Producto>();
  camposObligatorios : String[] = ['CODIGO','PRODUCTO','CANTIDAD','DESCRIPCION','PRECIO','MARCA','CATEGORIA','UBICACION'];
  itemsPerSlide = 5;
  singleSlideOffset = false;
  noWrap = true;
  dataExist : boolean = false;
  productosNuevos : Producto[] = new Array<Producto>();
  productosUpdate : Producto[] = new Array<Producto>();
  productosConflict : Producto[] = new Array<Producto>();
  productos : Producto[] = new Array<Producto>();

  constructor(private modal : SweetalertService, private getItems : GetItemsService) { 
    this.productos = this.getItems.getProductos();
  }

  ngOnInit(): void {
  }

  incomingfile(event:any) {
    this.file= event.target.files[0];
    this.Upload();
  }
  
  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) 
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0]; //Name sheet
      var worksheet = workbook.Sheets[first_sheet_name];
      let dataRaw = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      if(this.validarCampos(dataRaw)){
        this.dataExist = true;
        this.loadData(dataRaw);
      }else{
        this.modal.modalErrorHtml('Archivo incorrecto', 'Falta algún campo en el archivo Excel, se requieren los siguientes encabezados: '+this.getCampos());
        this.dataExist = false;
      }
      // this.mostrarData();
        
    }
    fileReader.readAsArrayBuffer(this.file);
  }
  loadData(dataRaw : any[]){
    this.productosNuevos = new Array<Producto>();
    this.productosUpdate = new Array<Producto>();
    this.productosConflict = new Array<Producto>();
    dataRaw.forEach((value) => {
      let usado = false;
      let dato = value as Producto;
      this.productos.forEach((product) => {
        let codigoProduct = product.CODIGO.toLowerCase();
        let codigoDato = dato.CODIGO.toLowerCase();
        let nameProduct = product.PRODUCTO.toLowerCase();
        let nameDato = dato.PRODUCTO.toLowerCase();
        if(codigoProduct == codigoDato && nameProduct == nameDato){
          this.productosUpdate.push(dato);
          usado = true;
        }
        if(codigoProduct == codigoDato && nameProduct != nameDato){
          this.productosConflict.push(dato);
          usado = true;
        }
      });
      if(!usado){
        this.productosNuevos.push(dato);
      }
    });
    console.log(this.productosNuevos);
    
  }
  mostrarData(){
    this.dataJSON.forEach((product) => {
    });
  }
  getCampos(): string{
    let x : string = "";
    this.camposObligatorios.forEach((value) => {
      x = x + '<h5><strong>' + value + '</strong></h5>';
    });
    return x;
  }
  validarCampos(data:any[]): any{
    let valido = true;
    data.forEach((value) => {
      this.camposObligatorios.forEach((field) => {
        if(!value.hasOwnProperty(field)){
          valido = false;
        }
      })
    });
    return valido;
  }

}
