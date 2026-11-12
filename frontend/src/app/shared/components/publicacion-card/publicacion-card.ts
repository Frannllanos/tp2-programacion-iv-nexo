import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Publicacion } from '../../../core/models/publicacion.model';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.css',
})
export class PublicacionCardComponent {
  @Input({ required: true }) publicacion!: Publicacion;
  @Input() usuarioActual: Usuario | null = null;
  @Input() mostrarAcciones = true;

  @Output() toggleLike = new EventEmitter<Publicacion>();
  @Output() eliminar = new EventEmitter<Publicacion>();

  get dioLike(): boolean {
    return this.usuarioActual ? this.publicacion.likes.includes(this.usuarioActual.id) : false;
  }

  get puedeEliminar(): boolean {
    return this.usuarioActual ? this.publicacion.autor.id === this.usuarioActual.id : false;
  }
}
