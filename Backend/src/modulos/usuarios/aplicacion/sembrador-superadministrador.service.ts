import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { UsuarioRepositorio } from '../dominio/usuario.repositorio';

/**
 * Resuelve el problema del "huevo y la gallina": sólo un superadministrador
 * puede crear instituciones, pero no existe un endpoint de registro público
 * para ese rol (sería un hueco de seguridad). Si SUPERADMIN_EMAIL/CLAVE están
 * definidos y ese usuario no existe aún, se crea una única vez al arrancar.
 */
@Injectable()
export class SembradorSuperadministrador implements OnApplicationBootstrap {
  private readonly logger = new Logger(SembradorSuperadministrador.name);

  constructor(
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.configService.get<string>('superadmin.email');
    const clave = this.configService.get<string>('superadmin.clave');

    if (!email || !clave) {
      return;
    }

    const existente = await this.usuarioRepositorio.buscarPorEmail(email);
    if (existente) {
      return;
    }

    const passwordHash = await bcrypt.hash(clave, 10);

    await this.usuarioRepositorio.crear({
      institucionId: null,
      nombre: 'Superadministrador',
      email,
      passwordHash,
      rol: RolUsuario.SUPERADMINISTRADOR,
    });

    this.logger.log(`Superadministrador inicial creado: ${email}`);
  }
}
