import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from "./cliente";
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';


@Injectable()
export class ClienteService {

  private urlEndPoint: string = "http://localhost:8080/api/clientes";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES) ;
    return this.http.get(this.urlEndPoint).pipe(
      tap(response => {
        let clientes = response as Cliente[];
        console.log('ClienteService:tap1')
        clientes.forEach(cliente => {
          console.log(cliente.nombre)
        }

        )
      }
      ),  
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          //cliente.createAt = formatDate(cliente.createAt,'fullDate','es-PE');
          return cliente;
        }

        );
      }
      ),
      tap(response => {
        console.log('ClienteService:tap2')
        response.forEach(cliente =>{
          console.log(cliente.nombre)
        }

        )
      })
      
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        };

        console.error(e.error.mensaje);
        Swal.fire('Error al crear el cliente', e.error.mensaje, 'error');
        return throwError(e);
      }
      )
    )
  }

  getCliente(id: Number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        };
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);

        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      }
      )
    )

  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(

      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire('Error al editar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      }
      )
    )
  }

  delete(id: Number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      }
      )
    )
  }

}
