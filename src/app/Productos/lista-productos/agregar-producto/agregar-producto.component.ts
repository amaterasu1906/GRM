import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/Models/catcategoria';
import { Producto } from 'src/app/Models/producto';
import { CatalogosService } from 'src/app/Services/database/catalogos.service';
import { SweetalertService } from 'src/app/Services/Modales/sweetalert.service';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss']
})
export class AgregarProductoComponent implements OnInit {
  categorias : Categoria[] = new Array<Categoria>();
  marcas : Categoria[] = new Array<Categoria>();
  locales : Categoria[] = new Array<Categoria>();
  formProducto! : FormGroup;
  porcentajeSubida : number = 0;
  mostrarProgressbar : boolean = false;
  nameImagen : string = "Subir imagen";
  urlImgDb : string ="";
  cargandoImagen : boolean = false;

  constructor(private dbCategorias : CatalogosService, private fb : FormBuilder, 
    private storage: AngularFireStorage, private modal : SweetalertService, 
    private db: AngularFirestore) { }

  ngOnInit(): void {
    this.categorias = this.dbCategorias.getCatCategoria();
    this.marcas = this.dbCategorias.getCatCategoriaMarcas();
    this.locales = this.dbCategorias.getCatCategoriaLocales();

    this.formProducto = this.fb.group({
      CANTIDAD : ['', Validators.compose([
        Validators.required, Validators.min(1)
      ])],
      CATEGORIA : ['', Validators.required],
      CODIGO : ['', Validators.required],
      CODIGOBARRAS : [''],
      DESCRIPCION : ['', Validators.required],
      IMGURL : [''],
      MARCA : ['', Validators.required],
      MEDIDA : [''],
      PRECIO : ['', Validators.compose([
        Validators.required, Validators.min(0.1)
      ])],
      PRODUCTO : ['', Validators.required],
      TIPOREPUESTO : [''],
      UBICACION : ['', Validators.required]      
    });
  }

  guardarProducto(){
    let producto : Producto = new Producto();
    this.formProducto.value.IMGURL = this.urlImgDb;
    producto = this.formProducto.value;
    producto.ESTATUS = true;
    producto.FECHAALTA = new Date().toISOString();
    producto.FECHAACTUALIZACION = new Date().toISOString();
    this.db.collection('Productos').add(producto).then((response) => {
      this.formProducto.reset();
      this.modal.modalSuccess('Añadir producto','Producto agregado correctamente');  
    }).catch(error =>{
      this.modal.modalError('Añadir producto','Error al añadir');
    });
  }

  uploadFile(event: any){
    console.log(event);
    if(event.target.files.length > 0){
      this.cargandoImagen = true;
      this.mostrarProgressbar = true;
      let name = new Date().getTime().toString();
      const file = event.target.files[0];
      this.nameImagen = file.name.toString();
      let extension = file.name.toString().substring(file.name.toString().lastIndexOf('.'));
      console.log(extension);
      
      const filePath = 'ImgProductos/producto_'+name+extension;
      const ref = this.storage.ref(filePath);
      const task = ref.put(file);

      task.then((response) => {
        console.log("imagen subida");
        this.cargandoImagen = false;
        ref.getDownloadURL().subscribe((url) => {
          console.log(url);
          this.urlImgDb = url;
        })
        
      }).catch((error) => {
        console.log("Sucedio un error al cargar la imagen");
        this.cargandoImagen = false;
      })

      task.percentageChanges().subscribe((porciento) => {
        this.porcentajeSubida = parseInt(porciento!.toString());
        if(this.porcentajeSubida >= 100){
          this.mostrarProgressbar = false;
        }
      });
    }else{
      console.log("Sin imagen");
      
    }
  }

}
