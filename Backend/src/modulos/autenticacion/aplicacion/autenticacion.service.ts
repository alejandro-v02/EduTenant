import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtPayload } from '../../../compartido/tipos/jwt-payload.interface';
import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { CorreoService } from '../../correo/aplicacion/correo.service';
import { Usuario } from '../../usuarios/dominio/usuario.entity';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';

const DURACION_TOKEN_RECUPERACION_MS = 30 * 60 * 1000;

interface RespuestaLogin {
  tokenAcceso: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string | null;
    email: string;
    rol: string;
    institucionId: string | null;
    perfilCompleto: boolean;
  };
}

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly jwtService: JwtService,
    private readonly correoService: CorreoService,
  ) {}

  async iniciarSesion(email: string, clave: string): Promise<RespuestaLogin> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(email);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const claveValida = await bcrypt.compare(clave, usuario.passwordHash);
    if (!claveValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: usuario.id,
      institucionId: usuario.institucionId,
      rol: usuario.rol,
    };

    return {
      tokenAcceso: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        institucionId: usuario.institucionId,
        perfilCompleto: this.esPerfilCompleto(usuario),
      },
    };
  }

  /**
   * Siempre responde igual, exista o no el email: así no se puede usar este endpoint para
   * averiguar qué correos están registrados en la plataforma.
   */
  async solicitarRecuperacion(email: string): Promise<void> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(email);
    if (!usuario || !usuario.activo) {
      return;
    }

    const tokenPlano = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(tokenPlano);
    const expira = new Date(Date.now() + DURACION_TOKEN_RECUPERACION_MS);

    await this.usuarioRepositorio.guardarTokenRecuperacion(usuario.id, tokenHash, expira);
    await this.correoService.enviarRecuperacionClave(usuario.email, usuario.nombre, tokenPlano);
  }

  async restablecerConToken(tokenPlano: string, claveNueva: string): Promise<void> {
    const tokenHash = this.hashToken(tokenPlano);
    const usuario = await this.usuarioRepositorio.buscarPorTokenRecuperacionValido(tokenHash);
    if (!usuario) {
      throw new UnauthorizedException('El enlace de recuperación no es válido o ha expirado');
    }

    const passwordHash = await bcrypt.hash(claveNueva, 10);
    await this.usuarioRepositorio.actualizarPasswordHash(usuario.id, passwordHash);
    await this.usuarioRepositorio.limpiarTokenRecuperacion(usuario.id);
  }

  private hashToken(tokenPlano: string): string {
    return crypto.createHash('sha256').update(tokenPlano).digest('hex');
  }

  /**
   * Coordinador y superadministrador siempre quedan completos (el coordinador se registra con
   * todos sus datos desde el inicio). Profesor y estudiante los crea el coordinador con lo
   * mínimo, así que deben terminar su propio perfil la primera vez que inician sesión.
   */
  private esPerfilCompleto(usuario: Usuario): boolean {
    if (usuario.rol !== RolUsuario.PROFESOR && usuario.rol !== RolUsuario.ESTUDIANTE) {
      return true;
    }
    return Boolean(
      usuario.apellido &&
        usuario.tipoDocumento &&
        usuario.numeroDocumento &&
        usuario.telefono &&
        usuario.direccion &&
        usuario.departamento &&
        usuario.municipio,
    );
  }
}
