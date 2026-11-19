import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comentario, ComentariosResponse } from '../models/publicacion.model';

@Injectable({ providedIn: 'root' })
export class ComentariosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/publicaciones`;

  listar(publicacionId: string, offset = 0, limit = 5): Observable<ComentariosResponse> {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit);

    return this.http.get<ComentariosResponse>(`${this.baseUrl}/${publicacionId}/comentarios`, { params });
  }

  crear(publicacionId: string, mensaje: string): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.baseUrl}/${publicacionId}/comentarios`, { mensaje });
  }

  editar(publicacionId: string, comentarioId: string, mensaje: string): Observable<Comentario> {
    return this.http.put<Comentario>(`${this.baseUrl}/${publicacionId}/comentarios/${comentarioId}`, { mensaje });
  }
}
