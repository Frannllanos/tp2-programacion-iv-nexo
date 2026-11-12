import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../media/cloudinary.service';
import { ImageService } from '../media/image.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly cloudinary: CloudinaryService,
    private readonly images: ImageService,
  ) {}

  async registrar(dto: RegistroDto, archivo: Express.Multer.File) {
    if (dto.contrasena !== dto.repetirContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const nacimiento = new Date(dto.fechaNacimiento);
    if (nacimiento > new Date()) throw new BadRequestException('La fecha de nacimiento no puede ser futura.');

    if (await this.usuarios.existeCorreoONombreUsuario(dto.correo, dto.nombreUsuario)) {
      throw new ConflictException('El correo o nombre de usuario ya está registrado.');
    }

    const bufferNormalizado = await this.images.normalizarPerfil(archivo.buffer);
    const subida = await this.cloudinary.uploadBuffer(bufferNormalizado, 'tp2-red-social/perfiles');

    try {
      const contrasenaHash = await bcrypt.hash(dto.contrasena, 12);
      const usuario = await this.usuarios.crear({
        nombre: dto.nombre.trim(),
        apellido: dto.apellido.trim(),
        correo: dto.correo.trim().toLowerCase(),
        nombreUsuario: dto.nombreUsuario.trim().toLowerCase(),
        contrasenaHash,
        fechaNacimiento: nacimiento,
        descripcion: dto.descripcion.trim(),
        fotoPerfilUrl: subida.secure_url,
        fotoPerfilPublicId: subida.public_id,
        perfil: 'usuario',
      });
      return this.usuarios.aPublico(usuario);
    } catch (error: any) {
      await this.cloudinary.destroy(subida.public_id);
      if (error?.code === 11000) throw new ConflictException('El correo o nombre de usuario ya existe.');
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarios.buscarParaLogin(dto.identificador);
    if (!usuario) throw new UnauthorizedException('Correo/usuario o contraseña incorrectos.');

    const coincide = await bcrypt.compare(dto.contrasena, usuario.contrasenaHash);
    if (!coincide) throw new UnauthorizedException('Correo/usuario o contraseña incorrectos.');

    return this.usuarios.aPublico(usuario);
  }
}
