import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CorreoModule } from '../correo/correo.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AutenticacionService } from './aplicacion/autenticacion.service';
import { AutenticacionController } from './infraestructura/controllers/autenticacion.controller';
import { JwtStrategy } from './infraestructura/estrategias/jwt.strategy';

@Module({
  imports: [
    UsuariosModule,
    CorreoModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secreto'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiracion') },
      }),
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, JwtStrategy],
})
export class AutenticacionModule {}
