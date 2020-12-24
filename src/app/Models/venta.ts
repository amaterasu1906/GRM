export class Venta{
    IDVENTA : string;
    USUARIO : string;
    SUBTOTAL : number;
    IVA : number = 0.16;
    TOTALVENTA : number;
    PRODUCTOSVENDIDOS : string;
    FECHAALTA : Date;
    constructor(){
        this.FECHAALTA = new Date();
        this.USUARIO = "";
        this.IDVENTA = "";
        this.SUBTOTAL = 0;
        this.TOTALVENTA = 0;
        this.PRODUCTOSVENDIDOS = "";
    }
}
export class VentaProducto{
    IDPRODUCTO : string;
    NUMEROITEMS : number;
    PRECIO : number;
    NOMBRE : string;
    constructor(){
        this.IDPRODUCTO = "";
        this.NOMBRE = "";
        this.NUMEROITEMS = 0;
        this.PRECIO = 0;
    }
}