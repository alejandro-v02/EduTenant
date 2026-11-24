import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { UMBRAL_NOTA_BAJA } from '../../../compartido/tipos/umbrales';

@Injectable()
export class CorreoService {
  private readonly logger = new Logger(CorreoService.name);
  private readonly resend: Resend | null;
  private readonly remitente: string;
  private readonly urlFrontend: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('correo.apiKey');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.remitente = this.configService.get<string>('correo.remitente')!;
    this.urlFrontend = this.configService.get<string>('correo.urlFrontend')!;
  }

  async enviarRecuperacionClave(destinatario: string, nombre: string, token: string): Promise<void> {
    const enlace = `${this.urlFrontend}/restablecer-clave?token=${token}`;
    await this.enviar(
      destinatario,
      'Recupera tu contraseña de Skolar',
      `
        <p>Hola ${nombre},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en Skolar.</p>
        <p><a href="${enlace}">Haz clic aquí para elegir una nueva contraseña</a></p>
        <p>Este enlace vence en 30 minutos. Si tú no solicitaste esto, puedes ignorar este correo.</p>
      `,
    );
  }

  async enviarAvisoInasistencia(destinatario: string, nombre: string, curso: string, fecha: string): Promise<void> {
    await this.enviar(
      destinatario,
      `Inasistencia registrada en ${curso}`,
      `
        <p>Hola ${nombre},</p>
        <p>Se registró una inasistencia tuya en <strong>${curso}</strong> el día ${fecha}.</p>
        <p>Si crees que esto es un error, comunícate con tu profesor o coordinador.</p>
      `,
    );
  }

  /** Sólo se envía si la nota está por debajo de {@link UMBRAL_NOTA_BAJA} (sobre 10). */
  async enviarAvisoNotaBaja(destinatario: string, nombre: string, curso: string, valor: number, descripcion: string): Promise<void> {
    if (valor >= UMBRAL_NOTA_BAJA) return;

    await this.enviar(
      destinatario,
      `Nueva nota registrada en ${curso}`,
      `
        <p>Hola ${nombre},</p>
        <p>Te registraron una nota de <strong>${valor}</strong> en <strong>${curso}</strong> (${descripcion}).</p>
        <p>Esta nota está por debajo del mínimo aprobatorio. Te recomendamos hablar con tu profesor.</p>
      `,
    );
  }

  async enviarAvisoMaterialNuevo(destinatario: string, nombre: string, curso: string, titulo: string): Promise<void> {
    await this.enviar(
      destinatario,
      `Nuevo material publicado en ${curso}`,
      `
        <p>Hola ${nombre},</p>
        <p>Se publicó nuevo material en <strong>${curso}</strong>: <strong>${titulo}</strong>.</p>
        <p>Ingresa a Skolar para consultarlo.</p>
      `,
    );
  }

  private async enviar(destinatario: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(`RESEND_API_KEY no configurada: correo "${subject}" no enviado a ${destinatario}`);
      return;
    }

    try {
      await this.resend.emails.send({ from: this.remitente, to: destinatario, subject, html });
    } catch (error) {
      // Un correo fallido nunca debe tumbar la operación (asistencia/nota/material) que lo originó.
      this.logger.error(`No se pudo enviar "${subject}" a ${destinatario}: ${(error as Error).message}`);
    }
  }
}
