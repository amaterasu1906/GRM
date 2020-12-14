import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Commons/home/home.component';
import { AgregarProductoComponent } from './Productos/lista-productos/agregar-producto/agregar-producto.component';
import { ListaComponent } from './Productos/lista-productos/lista/lista.component';
import { MostrarProductosComponent } from './Productos/lista-productos/mostrar-productos/mostrar-productos.component';
import { LoginComponent } from './Usuario/login/login.component';
import { ResumenComponent } from './Ventas/Resumen/resumen/resumen.component';
import { VenderComponent } from './Ventas/Vender/vender/vender.component';

const routes: Routes = [
  { path:'', component: HomeComponent},
  { path:'login', component: LoginComponent},
  { path:'venta', component: VenderComponent, children:[
    { path: 'resumen', component: ResumenComponent}
  ]},
  { path:'productos', component: ListaComponent},
  {path: 'productos/agregar', component: AgregarProductoComponent },
  {path: 'productos/productos', component: MostrarProductosComponent },
  {path: 'productos/productos/:producto', component: MostrarProductosComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
