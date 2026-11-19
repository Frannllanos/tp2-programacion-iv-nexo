import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Publicacion, PublicacionesResponse } from '../models/publicacion.model';

export interface FiltrosPublicaciones {
  orden?: 'fecha' | 'likes';
  offset?: number;
  limit?: number;
  usuarioId?: string;
}

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/publicaciones`;

  listar(filtros: FiltrosPublicaciones = {}): Observable<PublicacionesResponse> {
    let params = new HttpParams()
      .set('orden', filtros.orden ?? 'fecha')
      .set('offset', filtros.offset ?? 0)
      .set('limit', filtros.limit ?? 6);

    if (filtros.usuarioId) params = params.set('usuarioId', filtros.usuarioId);
    return this.http.get<PublicacionesResponse>(this.baseUrl, { params });
  }

  obtener(publicacionId: string): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.baseUrl}/${publicacionId}`);
  }

  crear(titulo: string, descripcion: string, imagen?: File): Observable<Publicacion> {
    const form = new FormData();
    form.append('titulo', titulo);
    form.append('descripcion', descripcion);
    if (imagen) form.append('imagen', imagen);
    return this.http.post<Publicacion>(this.baseUrl, form);
  }

  darMeGusta(publicacionId: string): Observable<Publicacion> {
    return this.http.post<Publicacion>(`${this.baseUrl}/${publicacionId}/me-gusta`, {});
  }

  quitarMeGusta(publicacionId: string): Observable<Publicacion> {
    return this.http.delete<Publicacion>(`${this.baseUrl}/${publicacionId}/me-gusta`);
  }

  eliminar(publicacionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${publicacionId}`);
  }
}
