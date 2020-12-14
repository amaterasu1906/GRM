export class Venta{
    IDVENTA : string;
    IDPRODUCTO : string;
    NUMEROITEMS : number;
    PRECIO : number;
    FECHAALTA : Date;
    constructor(){
        this.FECHAALTA = new Date();
        this.IDPRODUCTO = "";
        this.IDVENTA = "";
        this.NUMEROITEMS = 0;
        this.PRECIO = 0;
    }
}