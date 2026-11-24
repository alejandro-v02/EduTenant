import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuracion from './config/configuracion';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';
import { SuperadministradorModule } from './modulos/superadministrador/superadministrador.module';
import { InstitucionesModule } from './modulos/instituciones/instituciones.module';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';
import { CursosModule } from './modulos/cursos/cursos.module';
import { MatriculasModule } from './modulos/matriculas/matriculas.module';
import { AsistenciaModule } from './modulos/asistencia/asistencia.module';
import { NotasModule } from './modulos/notas/notas.module';
import { MaterialesModule } from './modulos/materiales/materiales.module';
import { PerfilModule } from './modulos/perfil/perfil.module';
import { NotificacionesModule } from './modulos/notificaciones/notificaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuracion],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('baseDeDatos.host'),
        port: configService.get<number>('baseDeDatos.puerto'),
        username: configService.get<string>('baseDeDatos.usuario'),
        password: configService.get<string>('baseDeDatos.clave'),
        database: configService.get<string>('baseDeDatos.nombre'),
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
        // Cómodo en desarrollo; en producción usar las migraciones
        // (npm run migration:run) y dejar esto en false.
        synchronize: true,
      }),
    }),
    AutenticacionModule,
    SuperadministradorModule,
    InstitucionesModule,
    UsuariosModule,
    CursosModule,
    MatriculasModule,
    AsistenciaModule,
    NotasModule,
    MaterialesModule,
    PerfilModule,
    NotificacionesModule,
  ],
})
export class AppModule {}
