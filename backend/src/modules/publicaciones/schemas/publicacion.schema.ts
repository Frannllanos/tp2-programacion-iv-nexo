import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Usuario } from '../../usuarios/schemas/usuario.schema';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema({ _id: true })
export class ComentarioEmbebido {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Usuario.name, required: true })
  usuarioId!: Types.ObjectId;
  @Prop({ required: true }) nombreUsuario!: string;
  @Prop({ required: true, maxlength: 1000 }) mensaje!: string;
  @Prop({ default: Date.now }) fecha!: Date;
  @Prop({ default: false }) modificado!: boolean;
}
const ComentarioSchema = SchemaFactory.createForClass(ComentarioEmbebido);

@Schema({ timestamps: true, collection: 'publicaciones' })
export class Publicacion {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Usuario.name, required: true, index: true })
  usuarioId!: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 150 })
  titulo!: string;

  @Prop({ required: true, trim: true, maxlength: 2000 })
  descripcion!: string;

  @Prop() imagenUrl?: string;
  @Prop() imagenPublicId?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Usuario.name }], default: [] })
  likes!: Types.ObjectId[];

  @Prop({ default: 0, min: 0, index: true })
  likesCount!: number;

  @Prop({ default: true, index: true })
  activa!: boolean;

  // Se modela para que Mi Perfil pueda renderizar comentarios existentes.
  // Las rutas para crearlos/editarlos corresponden recién al Sprint 3.
  @Prop({ type: [ComentarioSchema], default: [] })
  comentarios!: ComentarioEmbebido[];

  createdAt!: Date;
  updatedAt!: Date;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
PublicacionSchema.index({ activa: 1, createdAt: -1 });
PublicacionSchema.index({ activa: 1, likesCount: -1, createdAt: -1 });
