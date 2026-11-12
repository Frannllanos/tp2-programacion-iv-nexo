import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import {
  Model,
  Types,
} from 'mongoose';

import { CloudinaryService } from '../media/cloudinary.service';
import { ImageService } from '../media/image.service';
import { UsuariosService } from '../usuarios/usuarios.service';

import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';

import {
  Publicacion,
  PublicacionDocument,
} from './schemas/publicacion.schema';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly model:
      Model<PublicacionDocument>,

    private readonly usuarios:
      UsuariosService,

    private readonly cloudinary:
      CloudinaryService,

    private readonly images:
      ImageService,
  ) {}

  async crear(
    dto: CrearPublicacionDto,
    archivo?: Express.Multer.File,
  ) {
    await this.usuarios.obtenerDocumento(
      dto.usuarioId,
    );

    let subida:
      | {
          secure_url: string;
          public_id: string;
        }
      | undefined;

    if (archivo) {
      const normalizada =
        await this.images.normalizarPublicacion(
          archivo.buffer,
        );

      subida =
        await this.cloudinary.uploadBuffer(
          normalizada,
          'tp2-red-social/publicaciones',
        );
    }

    try {
      const creada =
        await this.model.create({
          usuarioId:
            new Types.ObjectId(
              dto.usuarioId,
            ),

          titulo:
            dto.titulo.trim(),

          descripcion:
            dto.descripcion.trim(),

          imagenUrl:
            subida?.secure_url,

          imagenPublicId:
            subida?.public_id,
        });

      return this.obtenerMapeada(
        String(creada._id),
      );
    } catch (error) {
      await this.cloudinary.destroy(
        subida?.public_id,
      );

      throw error;
    }
  }

  async listar(
    dto: ListarPublicacionesDto,
  ) {
    const filtro: Record<
      string,
      unknown
    > = {
      activa: true,
    };

    if (dto.usuarioId) {
      filtro['usuarioId'] =
        new Types.ObjectId(
          dto.usuarioId,
        );
    }

    const consulta =
      this.model
        .find(filtro)
        .populate(
          'usuarioId',
          'nombre apellido nombreUsuario fotoPerfilUrl',
        );

    if (dto.orden === 'likes') {
      consulta.sort({
        likesCount: -1,
        createdAt: -1,
      });
    } else {
      consulta.sort({
        createdAt: -1,
      });
    }

    const [docs, total] =
      await Promise.all([
        consulta
          .skip(dto.offset)
          .limit(dto.limit)
          .lean()
          .maxTimeMS(3000)
          .exec(),

        this.model
          .countDocuments(filtro)
          .maxTimeMS(3000)
          .exec(),
      ]);

    return {
      items:
        docs.map(
          (doc) =>
            this.mapear(doc),
        ),

      total,

      offset:
        dto.offset,

      limit:
        dto.limit,

      hasNext:
        dto.offset +
          docs.length <
        total,
    };
  }

  async bajaLogica(
    publicacionId: string,
    actorId: string,
  ): Promise<void> {
    const [post, actor] =
      await Promise.all([
        this.model
          .findById(
            publicacionId,
          )
          .exec(),

        this.usuarios.obtenerDocumento(
          actorId,
        ),
      ]);

    if (
      !post ||
      !post.activa
    ) {
      throw new NotFoundException(
        'Publicación no encontrada.',
      );
    }

    const esAutor =
      String(
        post.usuarioId,
      ) === actorId;

    const esAdmin =
      actor.perfil ===
      'administrador';

    if (
      !esAutor &&
      !esAdmin
    ) {
      throw new ForbiddenException(
        'Solo el autor o un administrador puede eliminar esta publicación.',
      );
    }

    post.activa = false;

    await post.save();
  }

  async darMeGusta(
    publicacionId: string,
    usuarioId: string,
  ) {
    await this.usuarios.obtenerDocumento(
      usuarioId,
    );

    const uid =
      new Types.ObjectId(
        usuarioId,
      );

    const updated =
      await this.model
        .findOneAndUpdate(
          {
            _id:
              publicacionId,

            activa:
              true,

            likes: {
              $ne: uid,
            },
          },
          {
            $addToSet: {
              likes:
                uid,
            },

            $inc: {
              likesCount:
                1,
            },
          },
          {
            new: true,
          },
        )
        .exec();

    if (!updated) {
      const existe =
        await this.model.exists({
          _id:
            publicacionId,

          activa:
            true,
        });

      if (!existe) {
        throw new NotFoundException(
          'Publicación no encontrada.',
        );
      }

      throw new ConflictException(
        'El usuario ya indicó Me gusta en esta publicación.',
      );
    }

    return this.obtenerMapeada(
      publicacionId,
    );
  }

  async quitarMeGusta(
    publicacionId: string,
    usuarioId: string,
  ) {
    await this.usuarios.obtenerDocumento(
      usuarioId,
    );

    const uid =
      new Types.ObjectId(
        usuarioId,
      );

    const updated =
      await this.model
        .findOneAndUpdate(
          {
            _id:
              publicacionId,

            activa:
              true,

            likes:
              uid,
          },
          {
            $pull: {
              likes:
                uid,
            },

            $inc: {
              likesCount:
                -1,
            },
          },
          {
            new: true,
          },
        )
        .exec();

    if (!updated) {
      const existe =
        await this.model.exists({
          _id:
            publicacionId,

          activa:
            true,
        });

      if (!existe) {
        throw new NotFoundException(
          'Publicación no encontrada.',
        );
      }

      throw new BadRequestException(
        'No se puede quitar un Me gusta que el usuario no había realizado.',
      );
    }

    return this.obtenerMapeada(
      publicacionId,
    );
  }

  private async obtenerMapeada(
    id: string,
  ) {
    const doc =
      await this.model
        .findOne({
          _id: id,
          activa: true,
        })
        .populate(
          'usuarioId',
          'nombre apellido nombreUsuario fotoPerfilUrl',
        )
        .lean()
        .exec();

    if (!doc) {
      throw new NotFoundException(
        'Publicación no encontrada.',
      );
    }

    return this.mapear(doc);
  }

  private mapear(
    doc: any,
  ) {
    const autor =
      doc.usuarioId;

    return {
      id:
        String(
          doc._id,
        ),

      titulo:
        doc.titulo,

      descripcion:
        doc.descripcion,

      imagenUrl:
        doc.imagenUrl,

      likes:
        (
          doc.likes ??
          []
        ).map(
          (
            id: Types.ObjectId,
          ) =>
            String(id),
        ),

      likesCount:
        doc.likesCount ??
        0,

      activa:
        doc.activa,

      autor: {
        id:
          String(
            autor._id,
          ),

        nombre:
          autor.nombre,

        apellido:
          autor.apellido,

        nombreUsuario:
          autor.nombreUsuario,

        fotoPerfilUrl:
          autor.fotoPerfilUrl,
      },

      comentarios:
        (
          doc.comentarios ??
          []
        ).map(
          (c: any) => ({
            id:
              String(
                c._id,
              ),

            usuarioId:
              String(
                c.usuarioId,
              ),

            nombreUsuario:
              c.nombreUsuario,

            mensaje:
              c.mensaje,

            fecha:
              c.fecha,

            modificado:
              c.modificado,
          }),
        ),

      createdAt:
        doc.createdAt,

      updatedAt:
        doc.updatedAt,
    };
  }
}