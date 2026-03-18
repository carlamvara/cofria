# COFRIA - Estrategia de Aplicación Móvil (Capacitor)

Se ha seleccionado **Capacitor** como la tecnología para llevar COFRIA a las tiendas de aplicaciones (App Store y Google Play). Esta decisión se basa en la necesidad de mantener la alta fidelidad visual del diseño actual y la eficiencia en el desarrollo.

## 1. Configuración de Capacitor

Para convertir este proyecto en una app nativa, se deben seguir estos pasos en el entorno de desarrollo local:

1. **Instalación**: `npm install @capacitor/core @capacitor/cli`
2. **Inicialización**: `npx cap init COFRIA com.cofria.app`
3. **Agregar Plataformas**: 
   - `npm install @capacitor/android @capacitor/ios`
   - `npx cap add android`
   - `npx cap add ios`

## 2. Manejo de Funcionalidades Nativas

Capacitor permite acceder al hardware del teléfono mediante plugins. Aquí están los recomendados para COFRIA:

### Seguridad y Biometría
- **Plugin**: `@capacitor-community/face-id` o `@native-biometric/capacitor`
- **Uso**: Para desbloquear el "Cofre" o confirmar el sellado de mensajes críticos usando FaceID o huella dactilar.

### Almacenamiento Seguro
- **Plugin**: `@capacitor/preferences`
- **Uso**: Para guardar tokens de sesión o claves de encriptación local de forma segura, fuera del alcance del navegador estándar.

### Notificaciones Push
- **Plugin**: `@capacitor/push-notifications`
- **Uso**: Avisar al usuario cuando un mensaje ha sido abierto, cuando un custodio ha aceptado, o cuando se acerca una fecha de apertura.

## 3. Optimizaciones de UI Aplicadas

Se han integrado reglas en `index.css` para asegurar una experiencia fluida:
- **Safe Areas**: Uso de `env(safe-area-inset-*)` para evitar que el notch o las barras de sistema tapen el contenido.
- **Touch Optimization**: Desactivación del zoom accidental y del resaltado de toques web para que la interacción se sienta 100% nativa.
- **Scroll**: Implementación de `-webkit-overflow-scrolling: touch` para un desplazamiento suave.

## 4. Conectividad de APIs
- Capacitor utiliza el motor de red estándar. No es necesario cambiar la lógica de `fetch` o `axios`.
- **CORS**: Al correr en un esquema nativo (`capacitor://` o `http://localhost`), es posible que se requieran ajustes en el backend para permitir peticiones desde estos orígenes.
