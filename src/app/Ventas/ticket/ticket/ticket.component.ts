import { Component, Input, OnInit } from '@angular/core';
import { ProductoCar } from 'src/app/Models/productosVenta';
import { ServicioProducto } from 'src/app/Models/servicio';
import { Venta } from 'src/app/Models/venta';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['../../../../assets/css/styleTicket.css']
})
export class TicketComponent implements OnInit {

  @Input() ventaImpresion : Venta = new Venta();
  @Input() carProductos : ProductoCar[] = new Array<ProductoCar>();
  @Input() carServicios : ServicioProducto[] = new Array<ServicioProducto>(); 
  @Input() fecha : string = "";
  constructor() { }

  ngOnInit(): void {
  }
  
}
