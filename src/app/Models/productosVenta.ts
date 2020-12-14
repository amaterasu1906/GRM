import { Producto } from './producto';

export class ProductoCar{
    PRODUCTO : Producto;
    CANTIDADITEMS : number;
    constructor(){
        this.PRODUCTO = new Producto();
        this.CANTIDADITEMS = 0;
    }
}