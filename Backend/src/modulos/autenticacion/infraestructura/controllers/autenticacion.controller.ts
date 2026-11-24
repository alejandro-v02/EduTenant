import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AutenticacionService } from '../../aplicacion/autenticacion.service';
import { LoginDto } from '../dto/login.dto';
import { RestablecerClaveTokenDto } from '../dto/restablecer-clave-token.dto';
import { SolicitarRecuperacionDto } from '../dto/solicitar-recuperacion.dto';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  iniciarSesion(@Body() dto: LoginDto) {
    return this.autenticacionService.iniciarSesion(dto.email, dto.clave);
  }

  @Post('olvide-clave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async solicitarRecuperacion(@Body() dto: SolicitarRecuperacionDto): Promise<void> {
    await this.autenticacionService.solicitarRecuperacion(dto.email);
  }

  @Post('restablecer-clave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restablecerClave(@Body() dto: RestablecerClaveTokenDto): Promise<void> {
    await this.autenticacionService.restablecerConToken(dto.token, dto.claveNueva);
  }
}
