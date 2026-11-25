import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PerfilUsuario, Usuario } from '../models/usuario.model';

export interface AdminCrearUsuarioPayload {
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  contrasena: string;
  repetirContrasena: string;
  fechaNacimiento: string;
  descripcion: string;
  perfil: PerfilUsuario;
  imagenPerfil: File;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  obtenerPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  crearDesdeAdmin(payload: AdminCrearUsuarioPayload): Observable<Usuario> {
    const form = new FormData();
    form.append('nombre', payload.nombre);
    form.append('apellido', payload.apellido);
    form.append('correo', payload.correo);
    form.append('nombreUsuario', payload.nombreUsuario);
    form.append('contrasena', payload.contrasena);
    form.append('repetirContrasena', payload.repetirContrasena);
    form.append('fechaNacimiento', payload.fechaNacimiento);
    form.append('descripcion', payload.descripcion);
    form.append('perfil', payload.perfil);
    form.append('imagenPerfil', payload.imagenPerfil);
    return this.http.post<Usuario>(this.baseUrl, form);
  }

  deshabilitar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  habilitar(id: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/${id}/habilitar`, {});
  }
}
