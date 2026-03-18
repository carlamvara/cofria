# COFRIA - Especificaciones de Lógica y Backend

Este documento detalla los requerimientos lógicos y de backend para asegurar que la aplicación sea portable y tecnológicamente agnóstica.

## 1. Registro de Auditoría (Audit Log)

### Categorías de Acciones
El sistema debe registrar y categorizar las siguientes acciones del usuario:
- `account_creation`: Cuando un usuario crea su cuenta por primera vez.
- `login`: Cuando un usuario inicia sesión.
- `logout`: Cuando un usuario cierra sesión.
- `draft_saved`: Cuando un mensaje se guarda como borrador.
- `sealed_direct`: Cuando un mensaje directo es sellado.
- `sealed_custody`: Cuando un mensaje con custodia es sellado.
- `custodian_accepted`: Cuando un custodio acepta la invitación.
- `message_opened`: Cuando un destinatario abre un mensaje.

### Cálculo de Permanencia
- El backend NO debe enviar una columna de "duración" pre-calculada para visualización simple, pero debe ser capaz de calcularla para reportes avanzados.
- La lógica de permanencia se deriva de: `Timestamp(logout) - Timestamp(login)`.
- Si una sesión expira por inactividad, el backend debe registrar un evento de `logout` automático con el timestamp de la última actividad detectada.

## 2. Gestión de Profesionales (CRUD)
- El acceso de los profesionales es autónomo (pueden crear su cuenta y usarla).
- El Administrador tiene permisos totales de CRUD sobre la tabla de profesionales.
- **Campos Requeridos**: Nombre, Email, Especialidad, Licencia, Estado (Activo/Inactivo).

## 3. Seguridad y Encriptación (Zero-Knowledge)
- **Encriptación en el Cliente**: El contenido de los mensajes DEBE encriptarse en el frontend antes de ser enviado al backend.
- **Metadata**: El backend solo debe almacenar metadatos necesarios para la entrega (emails, fechas de apertura, estados).
- **Autenticación**: Uso de Magic Links o OTP (One-Time Password) para eliminar la necesidad de contraseñas tradicionales.

## 4. Exportación de Datos
- El sistema debe permitir la exportación de tablas críticas en formatos `.csv` y `.xlsx` (Excel).
- El formato Excel debe incluir estilos (colores por categoría) y filtros automáticos.

---

## Arquitectura y Separación de Responsabilidades

Para mantener el código limpio ("Clean Code") y permitir la portabilidad (ej. a Expo/React Native), seguimos estos principios:

1. **UI Components (Presentación)**: Ubicados en `/ui/components`. Son "tontos", solo reciben datos y los muestran. No conocen la lógica del backend.
2. **Logic & Types (Contrato)**: Ubicados en `/logic`. Definen *qué* datos existen, no *cómo* se obtienen. Esto permite cambiar el backend sin tocar la UI.
3. **Services (Comunicación)**: Capa que maneja las llamadas a la API. Si cambias de tecnología, solo modificas esta capa.
## 5. Transición de Créditos a Transacciones Monetarias Directas

- **Eliminación del Sistema de Créditos**: Se elimina cualquier referencia a "créditos" en el frontend, backend y base de datos.
- **Transacciones Monetarias**: Todas las operaciones que anteriormente requerían créditos ahora se realizarán mediante transacciones monetarias directas (ej. pago con tarjeta de crédito, transferencia bancaria).
- **Registro de Transacciones**: El sistema debe registrar cada transacción monetaria, incluyendo:
    - `id`: Identificador único de la transacción.
    - `user_id`: Identificador del usuario que realiza la transacción.
    - `amount`: Monto de la transacción.
    - `currency`: Moneda utilizada.
    - `method`: Método de pago (ej. 'credit_card', 'wire_transfer').
    - `item`: Producto o servicio adquirido (ej. 'direct_seal', 'custody_seal').
    - `date`: Fecha y hora de la transacción.
- **Validación de Pago**: Antes de realizar cualquier acción que requiera pago (como sellar un mensaje), el sistema debe verificar que el pago se haya procesado correctamente.
- **Historial de Pagos**: El usuario debe tener acceso a su historial de transacciones monetarias.