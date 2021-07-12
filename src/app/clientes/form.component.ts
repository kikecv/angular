import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Sawl from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente()
  public titulo: string = "Crear Cliente"
  public errores: string[] = [];

  constructor(private clienteService: ClienteService, private router: Router, private activateRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void {
      this.activateRoute.params.subscribe(params => {
        let id = params['id']
        if(id){
          this.clienteService.getCliente(id).subscribe(
            cliente => this.cliente = cliente
          )
        }
      })
  }

  public create(): void {
    this.clienteService.create(this.cliente)
      .subscribe(
        cliente => {
          this.router.navigate(['clientes'])
          Sawl.fire(
            'Nuevo Cliente', ` El cliente ${cliente.nombre} ha sido creado con exito!!`, 'success'
          )
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código de error desde el backend: '+err.status)
          console.error(err.error.errors)
        }
      );
  }

 
  public update():void {
    
    this.clienteService.update(this.cliente).
    subscribe(
      json => {
        this.router.navigate(['clientes'])
          Sawl.fire(
            'Cliente Actualizado', `${json.mensaje}  ${json.cliente.nombre}`, 'success'
          )
      },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código de error desde el backend: '+err.status)
          console.error(err.error.errors)
        }
    )
  }

}
