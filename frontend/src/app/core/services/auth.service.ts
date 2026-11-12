import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

export interface RegistroPayload {
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  contrasena: string;
  repetirContrasena: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: File;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  registrar(payload: RegistroPayload): Observable<Usuario> {
    const form = new FormData();
    form.append('nombre', payload.nombre);
    form.append('apellido', payload.apellido);
    form.append('correo', payload.correo);
    form.append('nombreUsuario', payload.nombreUsuario);
    form.append('contrasena', payload.contrasena);
    form.append('repetirContrasena', payload.repetirContrasena);
    form.append('fechaNacimiento', payload.fechaNacimiento);
    form.append('descripcion', payload.descripcion);
    form.append('imagenPerfil', payload.imagenPerfil);
    return this.http.post<Usuario>(`${this.baseUrl}/registro`, form);
  }

  login(identificador: string, contrasena: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/login`, {
      identificador,
      contrasena,
    });
  }
}
