import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PuntoEstadistica {
  etiqueta: string;
  cantidad: number;
  fecha?: string;
  usuarioId?: string;
  publicacionId?: string;
}

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/publicaciones/estadisticas`;

  publicacionesPorUsuario(desde: string, hasta: string): Observable<PuntoEstadistica[]> {
    return this.http.get<PuntoEstadistica[]>(`${this.baseUrl}/publicaciones-por-usuario`, { params: this.params(desde, hasta) });
  }

  comentariosPorDia(desde: string, hasta: string): Observable<PuntoEstadistica[]> {
    return this.http.get<PuntoEstadistica[]>(`${this.baseUrl}/comentarios-por-dia`, { params: this.params(desde, hasta) });
  }

  comentariosPorPublicacion(desde: string, hasta: string): Observable<PuntoEstadistica[]> {
    return this.http.get<PuntoEstadistica[]>(`${this.baseUrl}/comentarios-por-publicacion`, { params: this.params(desde, hasta) });
  }

  private params(desde: string, hasta: string): HttpParams {
    return new HttpParams().set('desde', desde).set('hasta', hasta);
  }
}
