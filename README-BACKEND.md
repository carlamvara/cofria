# COFRIA - Documentación de Lógica de Negocio (Backend)

Este documento describe las reglas de negocio y la lógica requerida para el backend de COFRIA, asegurando la coherencia con la interfaz de usuario y la experiencia del usuario.

## 1. Productos y Pagos
COFRIA ofrece dos productos principales que requieren pago:
- **Mensaje Directo:** Envío inmediato tras el fallecimiento.
- **Mensaje Custodiado:** Envío tras el fallecimiento con custodia legal/notarial.

**Reglas de Negocio:**
- No existen suscripciones anuales ni licencias profesionales pagas.
- El pago se realiza por cada mensaje que se desea "sellar" (activar para envío futuro).
- Los profesionales no pagan por usar la plataforma; su beneficio es la visibilidad y las herramientas de gestión.

## 2. Programa de Referidos para Profesionales
Los profesionales pueden recomendar COFRIA a sus clientes/pacientes mediante un enlace de recomendación único.

**Reglas de Negocio:**
- **Mensaje Gratis Anual:** Cada profesional recibe 1 mensaje gratis al año (renovable automáticamente cada 12 meses desde su registro).
- **Premio por Referido:** Si un usuario se registra y **selle** (pague) un mensaje usando el link del profesional, este recibe 1 mensaje gratis adicional.
- **Límite:** El premio por referido está limitado a **un máximo de 1 mensaje gratis adicional por año**.
- **Expiración:** El mensaje gratuito obtenido por referido sigue las mismas reglas de renovación anual que el mensaje base.

## 3. Directorio de Profesionales
Los profesionales pueden elegir aparecer en un directorio público para que los usuarios de COFRIA los encuentren.

**Reglas de Negocio:**
- El profesional controla su visibilidad mediante un interruptor (`isPublic`).
- Campos obligatorios para el perfil público: Bio, Email de contacto público.
- La foto de perfil es opcional pero recomendada.

## 4. Gestión de Invitaciones
El profesional puede invitar a sus clientes para llevar un registro de su actividad.

**Reglas de Negocio:**
- El flujo de invitación es simplificado: un único enlace de recomendación.
- El sistema debe rastrear el estado de cada invitado:
    - `sent`: Invitación enviada (email registrado en la tabla del profesional).
    - `activated`: El cliente se registró en COFRIA usando el link.
    - `sealed`: El cliente realizó su primer pago (selló un mensaje).
- Al llegar al estado `sealed`, se dispara la lógica de recompensa para el profesional.

## 5. Estructura de Datos Sugerida (Firestore)

### Colección `professionals`
```json
{
  "uid": "string",
  "name": "string",
  "isPublic": "boolean",
  "publicEmail": "string",
  "bio": "string",
  "photoUrl": "string",
  "referralCode": "string (unique)",
  "stats": {
    "totalInvited": "number",
    "totalSealed": "number"
  },
  "benefits": {
    "annualMessageUsed": "boolean",
    "annualMessageResetDate": "timestamp",
    "referralCredits": "number (mensajes gratis acumulados)"
  }
}
```

### Colección `invitations` (Subcolección de `professionals`)
```json
{
  "email": "string",
  "date": "timestamp",
  "status": "sent | activated | sealed",
  "clientUid": "string (optional, linked after activation)"
}
```
