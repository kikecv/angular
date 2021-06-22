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
            'Nuevo Cliente', `Cliente ${cliente.nombre} creado con éxito!`, 'success'
          )
        }
      );
  }

 
  public update():void {
    
    this.clienteService.update(this.cliente).
    subscribe(
      cliente => {
        this.router.navigate(['clientes'])
          Sawl.fire(
            'Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con éxito!`, 'success'
          )
      }
    )
  }

}
