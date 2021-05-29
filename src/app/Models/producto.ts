import { DocumentReference } from '@angular/fire/firestore';
import { Categoria } from './catcategoria';

export class Producto{
    IDDB : string;
    ID : string;
    CANTIDAD : number;
    CANTIDADVENDIDA: number;
    CATEGORIA : string;
    CODIGO : string;
    CODIGOBARRAS : string;
    DESCRIPCION: string;
    ESTATUS: boolean;
    IMGURL: string;
    MARCA: string;
    MEDIDA: string;
    PRECIO: number;
    DESCUENTO : number;
    PRODUCTO: string;
    PROVEEDOR: string;
    TIPOREPUESTO: string;
    DATA1 : number;
    DATA2 : number;
    UBICACION: number;
    FECHAACTUALIZACION : string;
    FECHAALTA : string;
    ref! : DocumentReference;
    
    constructor(){
        this.IDDB = "";
        this.ID  = "";
        this.CANTIDAD  = 0;
        this.CANTIDADVENDIDA  = 0;
        this.CATEGORIA  = "";
        this.CODIGO  = "";
        this.CODIGOBARRAS  = "";
        this.DESCRIPCION = "";
        this.ESTATUS = false;
        this.IMGURL = "";
        this.MARCA = "";
        this.MEDIDA = "";
        this.PRECIO = -1;
        this.DESCUENTO = 0;
        this.PRODUCTO = "";
        this.PROVEEDOR = "";
        this.TIPOREPUESTO = "";
        this.DATA1 = 0;
        this.DATA2 = 0;
        this.UBICACION = -1;
        this.FECHAACTUALIZACION  = "";
        this.FECHAALTA  = "";
    }
}

export class ProductoExtends{
    IDDB : string;
    ID : string;
    CANTIDAD : number;
    CATEGORIA : string;
    CODIGO : string;
    CODIGOBARRAS : string;
    DESCRIPCION: string;
    ESTATUS: boolean;
    IMGURL: string;
    MARCA: string;
    MEDIDA: string;
    PRECIO: number;
    PRODUCTO: string;
    PROVEEDOR: string;
    TIPOREPUESTO: string;
    UBICACION: number;
    FECHAACTUALIZACION : string;
    FECHAALTA : string;
    ref! : DocumentReference;
    
    constructor(){
        this.IDDB = "";
        this.ID  = "";
        this.CANTIDAD  = 0;
        this.CATEGORIA  = "";
        this.CODIGO  = "";
        this.CODIGOBARRAS  = "";
        this.DESCRIPCION = "";
        this.ESTATUS = false;
        this.IMGURL = "";
        this.MEDIDA = "";
        this.PRECIO = -1;
        this.PRODUCTO = "";
        this.PROVEEDOR = "";
        this.TIPOREPUESTO = "";
        this.UBICACION = -1;
        this.FECHAACTUALIZACION  = "";
        this.FECHAALTA  = "";
        this.MARCA = "";
    }
}