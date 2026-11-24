import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../../compartido/tipos/jwt-payload.interface';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { UsuarioRepositorio } from '../../../usuarios/dominio/usuario.repositorio';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secreto'),
    });
  }

  // Se re-consulta el usuario en cada request (en vez de confiar ciegamente
  // en el payload) para que un cambio de rol/institución o una baja de
  // cuenta surtan efecto sin esperar a que expire el token.
  async validate(payload: JwtPayload): Promise<UsuarioAutenticado> {
    const usuario = await this.usuarioRepositorio.buscarPorId(payload.sub);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('El usuario no existe o está inactivo');
    }

    return {
      id: usuario.id,
      institucionId: usuario.institucionId,
      rol: usuario.rol,
    };
  }
}
