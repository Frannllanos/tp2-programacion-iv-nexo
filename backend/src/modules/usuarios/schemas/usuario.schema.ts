import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;
export type PerfilUsuario = 'usuario' | 'administrador';

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true, trim: true, maxlength: 60 })
  nombre!: string;

  @Prop({ required: true, trim: true, maxlength: 60 })
  apellido!: string;

  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true, maxlength: 120 })
  correo!: string;

  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true, maxlength: 30 })
  nombreUsuario!: string;

  @Prop({ required: true, select: false })
  contrasenaHash!: string;

  @Prop({ required: true })
  fechaNacimiento!: Date;

  @Prop({ required: true, trim: true, maxlength: 280 })
  descripcion!: string;

  @Prop({ required: true })
  fotoPerfilUrl!: string;

  @Prop({ required: true })
  fotoPerfilPublicId!: string;

  @Prop({ type: String, enum: ['usuario', 'administrador'], default: 'usuario', index: true })
  perfil!: PerfilUsuario;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
