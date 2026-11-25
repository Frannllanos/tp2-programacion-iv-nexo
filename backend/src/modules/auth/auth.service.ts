import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../media/cloudinary.service';
import { ImageService } from '../media/image.service';
import { UsuarioDocument } from '../usuarios/schemas/usuario.schema';
import { UsuarioPublico, UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';
import { AdminCrearUsuarioDto } from './dto/admin-crear-usuario.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly cloudinary: CloudinaryService,
    private readonly images: ImageService,
    private readonly jwt: JwtService,
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

    let usuario: UsuarioDocument;
    try {
      const contrasenaHash = await bcrypt.hash(dto.contrasena, 12);
      usuario = await this.usuarios.crear({
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
    } catch (error: any) {
      await this.cloudinary.destroy(subida.public_id);
      if (error?.code === 11000) throw new ConflictException('El correo o nombre de usuario ya existe.');
      throw error;
    }

    const usuarioPublico = this.usuarios.aPublico(usuario);
    const token = await this.generarToken(usuarioPublico);
    return { usuario: usuarioPublico, token };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarios.buscarParaLogin(dto.identificador);
    if (!usuario) throw new UnauthorizedException('Correo/usuario o contraseña incorrectos.');
    if (usuario.activo === false) {
      throw new ForbiddenException('Tu usuario se encuentra deshabilitado. Contacta a un administrador.');
    }

    const coincide = await bcrypt.compare(dto.contrasena, usuario.contrasenaHash);
    if (!coincide) throw new UnauthorizedException('Correo/usuario o contraseña incorrectos.');

    const usuarioPublico = this.usuarios.aPublico(usuario);
    const token = await this.generarToken(usuarioPublico);
    return { usuario: usuarioPublico, token };
  }

  async crearUsuarioDesdeAdmin(dto: AdminCrearUsuarioDto, archivo: Express.Multer.File): Promise<UsuarioPublico> {
    if (dto.contrasena !== dto.repetirContrasena) {
      throw new BadRequestException('Las contrasenas no coinciden.');
    }

    const nacimiento = new Date(dto.fechaNacimiento);
    if (nacimiento > new Date()) throw new BadRequestException('La fecha de nacimiento no puede ser futura.');

    if (await this.usuarios.existeCorreoONombreUsuario(dto.correo, dto.nombreUsuario)) {
      throw new ConflictException('El correo o nombre de usuario ya esta registrado.');
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
        perfil: dto.perfil,
        activo: true,
      });
      return this.usuarios.aPublico(usuario);
    } catch (error: any) {
      await this.cloudinary.destroy(subida.public_id);
      if (error?.code === 11000) throw new ConflictException('El correo o nombre de usuario ya existe.');
      throw error;
    }
  }

  async autorizar(usuarioId: string): Promise<UsuarioPublico> {
    return this.usuarios.obtenerPublico(usuarioId);
  }

  async refrescar(payload: JwtPayload): Promise<{ token: string }> {
    const nuevoPayload: JwtPayload = {
      sub: payload.sub,
      correo: payload.correo,
      nombreUsuario: payload.nombreUsuario,
      perfil: payload.perfil,
    };

    return { token: await this.jwt.signAsync(nuevoPayload) };
  }

  private generarToken(usuario: UsuarioPublico): Promise<string> {
    const payload: JwtPayload = {
      sub: usuario.id,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil,
    };

    return this.jwt.signAsync(payload);
  }
}
