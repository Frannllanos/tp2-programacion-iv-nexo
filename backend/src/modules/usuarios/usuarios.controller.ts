import { Controller, Get, Param } from '@nestjs/common';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Get(':id')
  obtener(@Param('id', MongoIdPipe) id: string) {
    return this.usuarios.obtenerPublico(id);
  }
}
