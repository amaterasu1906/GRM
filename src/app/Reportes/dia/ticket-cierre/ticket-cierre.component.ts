import { Component, Input, OnInit } from '@angular/core';
import { ProductoCar } from 'src/app/Models/productosVenta';
import { ServicioProducto } from 'src/app/Models/servicio';
import { Venta } from 'src/app/Models/venta';

@Component({
  selector: 'app-ticket-cierre',
  templateUrl: './ticket-cierre.component.html',
  styleUrls: ['../../../../assets/css/stylecierre.css']
})
export class TicketCierreComponent implements OnInit {

  @Input() venta = {
    TOTALVENTA : 0,
    totalProductosVendidos : 0,
    numeroVentas : 0
  };
  @Input() carProductos : ProductoCar[] = new Array<ProductoCar>();
  @Input() carServicios : ServicioProducto[] = new Array<ServicioProducto>(); 
  @Input() fecha : string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
