import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly model: Model<PublicacionDocument>,
  ) {}

  private rango(desde?: string, hasta?: string): { desde: Date; hasta: Date } {
    if (!desde || !hasta) {
      throw new BadRequestException('Debe indicar desde y hasta.');
    }

    const inicio = new Date(`${desde}T00:00:00.000Z`);
    const fin = new Date(`${hasta}T23:59:59.999Z`);
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      throw new BadRequestException('El rango de fechas no es valido.');
    }
    if (inicio > fin) {
      throw new BadRequestException('La fecha desde no puede ser posterior a hasta.');
    }
    return { desde: inicio, hasta: fin };
  }

  async publicacionesPorUsuario(desde?: string, hasta?: string) {
    const rango = this.rango(desde, hasta);
    return this.model.aggregate([
      { $match: { createdAt: { $gte: rango.desde, $lte: rango.hasta } } },
      { $group: { _id: '$usuarioId', cantidad: { $sum: 1 } } },
      { $lookup: { from: 'usuarios', localField: '_id', foreignField: '_id', as: 'usuario' } },
      { $unwind: '$usuario' },
      {
        $project: {
          _id: 0,
          usuarioId: { $toString: '$_id' },
          etiqueta: '$usuario.nombreUsuario',
          cantidad: 1,
        },
      },
      { $sort: { cantidad: -1, etiqueta: 1 } },
    ]).exec();
  }

  async comentariosPorDia(desde?: string, hasta?: string) {
    const rango = this.rango(desde, hasta);
    return this.model.aggregate([
      { $unwind: '$comentarios' },
      { $match: { 'comentarios.fecha': { $gte: rango.desde, $lte: rango.hasta } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$comentarios.fecha' } },
          cantidad: { $sum: 1 },
        },
      },
      { $project: { _id: 0, fecha: '$_id', etiqueta: '$_id', cantidad: 1 } },
      { $sort: { fecha: 1 } },
    ]).exec();
  }

  async comentariosPorPublicacion(desde?: string, hasta?: string) {
    const rango = this.rango(desde, hasta);
    return this.model.aggregate([
      { $unwind: '$comentarios' },
      { $match: { 'comentarios.fecha': { $gte: rango.desde, $lte: rango.hasta } } },
      { $group: { _id: { id: '$_id', titulo: '$titulo' }, cantidad: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          publicacionId: { $toString: '$_id.id' },
          etiqueta: '$_id.titulo',
          cantidad: 1,
        },
      },
      { $sort: { cantidad: -1, etiqueta: 1 } },
    ]).exec();
  }
}
