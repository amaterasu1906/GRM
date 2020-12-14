export class Categoria{
    IDDB : string;
    DESCRIPCION : string;
    ESTATUS : boolean;
    FECHAALTA : Date;
    ID : number;
    NOMBRE : string;

    constructor(){
        this.IDDB = "";
        this.DESCRIPCION = "";
        this.ESTATUS = false;
        this.FECHAALTA = new Date();
        this.ID = -1;
        this.NOMBRE = "";
    }
}