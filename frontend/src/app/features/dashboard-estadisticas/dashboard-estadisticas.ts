import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadisticasService, PuntoEstadistica } from '../../core/services/estadisticas.service';
import { obtenerMensajeError } from '../../core/services/http-error.util';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css',
})
export class DashboardEstadisticas implements OnInit {
  private readonly estadisticas = inject(EstadisticasService);
  private readonly modal = inject(ModalService);

  readonly desde = signal('');
  readonly hasta = signal('');
  readonly publicacionesUsuario = signal<PuntoEstadistica[]>([]);
  readonly comentariosDia = signal<PuntoEstadistica[]>([]);
  readonly comentariosPublicacion = signal<PuntoEstadistica[]>([]);
  readonly cargando = signal(false);

  readonly maxPublicaciones = computed(() => Math.max(1, ...this.publicacionesUsuario().map((p) => p.cantidad)));
  readonly maxComentariosDia = computed(() => Math.max(1, ...this.comentariosDia().map((p) => p.cantidad)));
  readonly totalComentariosPublicacion = computed(() => this.comentariosPublicacion().reduce((acc, p) => acc + p.cantidad, 0));
  readonly linePoints = computed(() => {
    const datos = this.comentariosDia();
    if (datos.length === 0) return '';
    const max = this.maxComentariosDia();
    if (datos.length === 1) return `20,${180 - (datos[0].cantidad / max) * 140} 380,${180 - (datos[0].cantidad / max) * 140}`;
    return datos.map((p, i) => {
      const x = 20 + (i / (datos.length - 1)) * 360;
      const y = 180 - (p.cantidad / max) * 140;
      return `${x},${y}`;
    }).join(' ');
  });

  ngOnInit(): void {
    const hoy = new Date();
    const hace30 = new Date(hoy);
    hace30.setDate(hoy.getDate() - 30);
    this.hasta.set(this.formatearFecha(hoy));
    this.desde.set(this.formatearFecha(hace30));
    this.cargar();
  }

  actualizarDesde(event: Event): void {
    this.desde.set((event.target as HTMLInputElement).value);
  }

  actualizarHasta(event: Event): void {
    this.hasta.set((event.target as HTMLInputElement).value);
  }

  cargar(): void {
    if (!this.desde() || !this.hasta()) return;
    this.cargando.set(true);
    let pendientes = 3;
    const terminar = () => {
      pendientes -= 1;
      if (pendientes === 0) this.cargando.set(false);
    };
    const fallo = (titulo: string, error: unknown) => {
      terminar();
      this.modal.error(titulo, obtenerMensajeError(error));
    };

    this.estadisticas.publicacionesPorUsuario(this.desde(), this.hasta()).subscribe({
      next: (datos) => { this.publicacionesUsuario.set(datos); terminar(); },
      error: (error) => fallo('No se pudieron cargar las publicaciones por usuario', error),
    });
    this.estadisticas.comentariosPorDia(this.desde(), this.hasta()).subscribe({
      next: (datos) => { this.comentariosDia.set(datos); terminar(); },
      error: (error) => fallo('No se pudieron cargar los comentarios por dia', error),
    });
    this.estadisticas.comentariosPorPublicacion(this.desde(), this.hasta()).subscribe({
      next: (datos) => { this.comentariosPublicacion.set(datos); terminar(); },
      error: (error) => fallo('No se pudieron cargar los comentarios por publicacion', error),
    });
  }

  porcentajeBarra(valor: number): number {
    return Math.max(4, Math.round((valor / this.maxPublicaciones()) * 100));
  }

  porcentajeDonut(valor: number): number {
    const total = this.totalComentariosPublicacion();
    return total === 0 ? 0 : Math.round((valor / total) * 100);
  }

  donutGradient(): string {
    const datos = this.comentariosPublicacion();
    const total = this.totalComentariosPublicacion();
    if (!datos.length || total === 0) return 'conic-gradient(#202b41 0 100%)';
    const colores = ['#7c3aed', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#c084fc', '#f97316'];
    let acumulado = 0;
    const partes = datos.map((dato, i) => {
      const inicio = acumulado;
      acumulado += (dato.cantidad / total) * 100;
      return `${colores[i % colores.length]} ${inicio}% ${acumulado}%`;
    });
    return `conic-gradient(${partes.join(', ')})`;
  }

  colorLeyenda(indice: number): string {
    return ['#7c3aed', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#c084fc', '#f97316'][indice % 8];
  }

  private formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
