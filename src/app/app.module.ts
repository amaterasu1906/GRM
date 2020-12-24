import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginComponent } from './Usuario/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UsuarioService } from './Services/Users/usuario.service';
import { ListaComponent } from './Productos/lista-productos/lista/lista.component';
import { AgregarProductoComponent } from './Productos/lista-productos/agregar-producto/agregar-producto.component';
import { VenderComponent } from './Ventas/Vender/vender/vender.component';
import { MostrarProductosComponent } from './Productos/lista-productos/mostrar-productos/mostrar-productos.component';
import { HomeComponent } from './Commons/home/home.component';
import { CatalogosService } from './Services/database/catalogos.service';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { GetItemsService } from './Services/database/get-items.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DatePipe } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import { allIcons } from 'ng-bootstrap-icons/icons';
import { ResumenComponent } from './Ventas/Resumen/resumen/resumen.component';
import { ExcelComponent } from './Productos/Data/excel/excel.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    ListaComponent,
    AgregarProductoComponent,
    VenderComponent,
    MostrarProductosComponent,
    HomeComponent,
    ResumenComponent,
    ExcelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    AngularFireStorageModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    BootstrapIconsModule.pick(allIcons),
    CarouselModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [
    AngularFireAuth,
    UsuarioService,
    CatalogosService,
    GetItemsService,
    DatePipe,
    BootstrapIconsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
