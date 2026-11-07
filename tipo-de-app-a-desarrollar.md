# 🏙️ UrbanAlert - Sistema de Reporte de Reclamos e Incidentes Urbanos

Documento de especificación, arquitectura y alcance del **Trabajo Práctico Integrador Final** para la materia de Desarrollo Móvil.

---

## 📌 1. Definición del Proyecto

### 1.1 Nombre de la Aplicación
**UrbanAlert** *(o Reclamos Urbanos)*

### 1.2 ¿Qué problema resuelve?
En los entornos urbanos, los vecinos detectan a diario anomalías en la vía pública (luminarias rotas, baches peligrosos, semáforos fuera de servicio, microbasurales, rotura de caños de agua o árboles en riesgo de caída). Con frecuencia, los canales tradicionales de reclamo son lentos, carecen de georreferenciación exacta y no permiten adjuntar evidencia fotográfica clara.

**UrbanAlert** soluciona esto brindando una aplicación móvil ágil que permite a cada vecino:
1. Detectar el problema en el lugar.
2. Capturar automáticamente las coordenadas GPS exactas.
3. Tomar una fotografía del incidente como prueba.
4. Categorizar y enviar el reporte a una base de datos centralizada en la nube.
5. Hacer seguimiento del estado de sus reportes (Pendiente, En Revisión, Resuelto, Cancelado).
6. Visualizar en un mapa interactivo todos los reclamos registrados para evitar duplicados y conocer el estado del barrio.

### 1.3 ¿Quiénes la utilizarán?
* **Vecinos y ciudadanos:** Usuarios que transitan por la ciudad y desean colaborar con el mantenimiento urbano.
* **Administración municipal / Vecinal (en etapas futuras):** Gestores que auditan, actualizan el estado de las incidencias y coordinan cuadrillas de reparación.

---

## 🎯 2. Alineación con las Consignas del TPI

El proyecto cumple y supera los requisitos exigidos en las pautas del trabajo práctico:

| Requisito TPI | Implementación en UrbanAlert | Estado / Viabilidad |
| :--- | :--- | :--- |
| **A. Interfaz y Navegación** | Más de 5 pantallas interactivas con React Navigation (Native Stack), navegación condicional autenticado/no autenticado, componentes modulares reutilizables y formularios controlados con validación de estado. | ✅ Cumple |
| **B. Autenticación** | Registro e inicio de sesión con Firebase Authentication (Email y Password). Control de sesión persistente con `onAuthStateChanged` y `AsyncStorage`. Rutas públicas protegidas frente a rutas privadas. | ✅ Cumple |
| **C. Persistencia Remota** | Base de datos Cloud Firestore con **CRUD completo** sobre la entidad `reportes`: creación, consulta filtrada, modificación de estado/datos y cancelación/borrado. | ✅ Cumple |
| **D. Datos por Usuario y Seguridad** | Cada reporte incluye el `userId` (`request.auth.uid`). Las Security Rules garantizan que un usuario solo pueda editar o eliminar sus propios reclamos. | ✅ Cumple |
| **E. Organización del Código** | Separación clara de capas: `context/`, `screens/`, `components/`, `services/`, `navigation/` y `styles/`. Desacoplamiento de lógica de Firebase fuera de las pantallas. | ✅ Cumple |
| **F. Git y GitHub** | Repositorio organizado, ramas de trabajo, commits significativos y archivo `README.md` exhaustivo sin credenciales sensibles expuestas. | ✅ Cumple |
| **Complementaria: Imágenes** | Uso de `expo-image-picker` para capturar fotos con la cámara o seleccionarlas de la galería y asociar la URI local al reporte y al avatar de perfil. | ✅ Cumple (Opción A) |
| **Complementaria: GPS y Mapas** | Uso de `expo-location` para obtener latitud/longitud automática en tiempo real y `react-native-maps` para renderizar marcadores interactivos en un mapa urbano. | ✅ Cumple (Opción B) |

---

## 🚀 3. Alcance del MVP vs. Funciones Futuras

### 🟢 Producto Mínimo Viable (MVP - A entregar)
* **Autenticación completa:**
  * Registro de nuevo usuario (nombre, correo y contraseña).
  * Inicio de sesión y cierre de sesión seguro.
  * Persistencia automática de sesión en el dispositivo.
* **Gestión de Reclamos (CRUD Firestore):**
  * **Crear:** Formulario con título, descripción, selección de categoría mediante selector/chips, captura automática de geolocalización GPS y adjunto de foto de evidencia.
  * **Leer / Consultar:** Listado de "Mis Reportes" del usuario autenticado ordenados por fecha, con badge de estado.
  * **Actualizar:** Modificación de descripción, categoría o cambio de estado a "Cancelado" / "Resuelto".
  * **Eliminar:** Borrado seguro del reporte de Firestore.
* **Mapa de Incidentes:**
  * Pantalla con mapa interactivo centrado en la ubicación del usuario o ciudad, con pines/marcadores diferenciados por estado o categoría.
  * Callout/Tarjeta flotante al tocar un marcador con el título, categoría y estado.
* **Perfil de Usuario:**
  * Visualización de datos de la cuenta (UID, Email), estadísticas breves (total de reclamos generados) y opción de foto de perfil.

### 🔮 Funcionalidades Futuras (Roadmap post-entrega)
* Rol Administrador para que el municipio cambie estados a "En cuadrilla" o "Finalizado".
* Notificaciones push cuando el estado del reclamo cambie a "Resuelto".
* Sistema de votación vecinal ("A mí también me afecta este bache").
* Subida de imágenes a Firebase Storage en la nube.

---

## 🗄️ 4. Modelo de Datos y Seguridad (Firestore)

### 4.1 Colección Principal: `reportes`
Cada documento dentro de `/reportes/{reporteId}` tendrá la siguiente estructura:

```typescript
interface Reporte {
  id?: string;                        // ID generado automáticamente por Firestore
  userId: string;                     // UID del usuario autenticado (Firebase Auth)
  userEmail: string;                  // Correo del usuario que reportó
  titulo: string;                     // Breve resumen (ej: "Luminaria apagada")
  descripcion: string;                // Detalle del problema (ej: "Lleva 3 noches sin encender")
  categoria: CategoriaReporte;        // Categoría tipificada
  estado: EstadoReporte;              // Estado del ciclo de vida
  fotoUri: string | null;             // URI local de la imagen adjunta
  coordenadas: {
    latitude: number;                 // Latitud GPS obtenida por expo-location
    longitude: number;                // Longitud GPS obtenida por expo-location
  } | null;
  direccionAprox?: string;            // Texto de calle o intersección aproximada
  fechaCreacion: string;              // ISO String (ej: "2026-11-06T21:30:00Z")
  fechaActualizacion?: string;        // Última fecha de edición
}

type CategoriaReporte = 
  | "Baches y Calzada"
  | "Iluminación Pública"
  | "Semáforos"
  | "Basura y Residuos"
  | "Arbolado y Espacios Verdes"
  | "Otros";

type EstadoReporte = "Pendiente" | "En revisión" | "Resuelto" | "Cancelado";
```

### 4.2 Colección Secundaria: `usuarios`
Documento `/usuarios/{userId}` para almacenar datos complementarios de perfil:
```typescript
interface UsuarioPerfil {
  userId: string;
  nombre: string;
  email: string;
  fotoPerfilUri: string | null;
  fechaRegistro: string;
}
```

### 4.3 Reglas de Seguridad (`firestore.rules`)
Garantizan el aislamiento de datos y la integridad según el requerimiento D:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Reglas para reportes de incidentes
    match /reportes/{reporteId} {
      // 1. Lectura: los usuarios autenticados pueden leer los reportes para visualizarlos en el mapa y en sus listas
      allow read: if request.auth != null;

      // 2. Creación: solo autenticados, y el userId debe coincidir con su uid
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.titulo is string
                    && request.resource.data.estado in ["Pendiente", "En revisión", "Resuelto", "Cancelado"];

      // 3. Modificación y eliminación: solo el creador del reporte puede modificarlo o borrarlo
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Reglas para perfiles de usuario
    match /usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🗺️ 5. Flujo de Navegación y Pantallas

```
                    ┌─────────────────────────┐
                    │      AppNavigation      │
                    └────────────┬────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
   [ AuthStack (Público) ]                     [ AppStack (Privado) ]
   ├── LoginScreen                             ├── HomeScreen (Dashboard)
   └── RegisterScreen                          ├── NewReportScreen (Crear reclamo)
                                               ├── MyReportsScreen (CRUD / Listado)
                                               ├── ReportDetailScreen (Detalle/Editar)
                                               ├── MapScreen (Mapa de incidentes)
                                               └── ProfileScreen (Perfil y ajustes)
```

### 5.1 Descripción de Pantallas

1. **`LoginScreen` & `RegisterScreen`:**
   * Acceso por correo y contraseña.
   * Mensajes de error claros (usuario no existe, contraseña débil, correo inválido).
   * Redirección reactiva mediante `AuthContext`.

2. **`HomeScreen` (Dashboard de Inicio):**
   * Saludo al usuario con su nombre o email.
   * Tarjetas resumen con métricas: "Mis reportes activos", "Reportes resueltos".
   * Accesos directos llamativos:
     * ➕ *Nuevo Reporte*: botón flotante o destacado para reportar en el momento.
     * 🗺️ *Ver Mapa*: acceso directo al mapa interactivo.
     * 📋 *Mis Reclamos*: acceso a la gestión de reclamos personales.

3. **`NewReportScreen` (Formulario de Alta):**
   * Campo de texto para título y descripción.
   * Selector de categoría (botones táctiles o chips seleccionables con iconos alusivos).
   * **Sección GPS:** botón *"Detectar mi ubicación actual"*, con spinner de carga y visualización de latitud/longitud detectadas.
   * **Sección Foto:** botón *"Tomar Foto"* o *"Subir de Galería"*, con vista previa de la imagen seleccionada y opción de cambiarla.
   * Botón *"Publicar Reclamo"* que persiste el documento en Firestore.

4. **`MyReportsScreen` (Gestor CRUD de Reclamos):**
   * `FlatList` con pull-to-refresh (`RefreshControl`).
   * Tarjetas por reclamo con: foto pequeña (thumbnail), título, fecha, categoría y etiqueta de estado con código de color:
     * 🟡 *Pendiente* (Amarillo)
     * 🔵 *En revisión* (Azul)
     * 🟢 *Resuelto* (Verde)
     * 🔴 *Cancelado* (Gris/Rojo)
   * Acciones en cada tarjeta: editar descripción, marcar como resuelto o eliminar con confirmación (`Alert.alert`).

5. **`MapScreen` (Mapa de Reclamos Urbanos):**
   * Mapa de pantalla completa con `react-native-maps`.
   * Centrado automático en la ubicación GPS actual del usuario.
   * Pines/Marcadores (`<Marker>`) distribuidos en el mapa por cada reporte activo.
   * Al hacer clic en un pin, despliega un `<Callout>` con el título, categoría, foto y estado del reclamo.

6. **`ProfileScreen` (Perfil de Usuario):**
   * Avatar del usuario personalizable con `expo-image-picker`.
   * Información de la cuenta (Email, UID).
   * Contador de reportes realizados por el usuario.
   * Botón destacado para **Cerrar Sesión** (`logout`).

---

## 📂 6. Estructura del Código Fuente

```text
src/
├── components/            # Componentes reutilizables de UI
│   ├── CustomButton.js    # Botón estilizado primario/secundario/peligro
│   ├── CustomInput.js     # Campo de texto estandarizado con etiquetas y errores
│   ├── StatusBadge.js     # Etiqueta con color según estado del reporte
│   └── ReportCard.js      # Tarjeta para mostrar el reporte en listados
│
├── context/
│   └── AuthContext.js     # Contexto global para sesión de usuario con Firebase Auth
│
├── firebase/
│   ├── firebase.js        # Inicialización de la app de Firebase y exportación de db/auth
│   └── authService.js     # Funciones de login, registro, logout y cambio de contraseña
│
├── navigation/
│   ├── AppNavigation.js   # Orquestador que conmuta entre AuthStack y AppStack
│   ├── AuthStack.js       # Stack de autenticación (Login, Register)
│   └── AppStack.js        # Stack principal autenticado (Home, Reportes, Mapa, Perfil)
│
├── screens/
│   ├── LoginScreen.js     # Pantalla de Login
│   ├── RegisterScreen.js  # Pantalla de Registro
│   ├── HomeScreen.js      # Dashboard principal
│   ├── AddReportScreen.js # Pantalla para crear un nuevo reclamo
│   ├── ReportsScreen.js   # Pantalla con listado de mis reclamos (CRUD)
│   ├── MapScreen.js       # Pantalla con el mapa interactivo y marcadores
│   └── PerfilScreen.js    # Pantalla de perfil de usuario
│
├── services/
│   ├── reportService.js   # Lógica desacoplada de Firestore (Create, Read, Update, Delete)
│   ├── locationService.js # Envoltorio para expo-location (solicitud de permisos y GPS)
│   ├── ImageService.js    # Envoltorio para expo-image-picker (cámara y galería)
│   └── userService.js     # Gestión de datos complementarios de usuario en Firestore
│
└── styles/                # Estilos modulares organizados por pantalla
    ├── CommonStyles.js    # Paleta de colores, tipografías y espaciados globales
    ├── HomeStyles.js
    ├── ReportStyles.js
    ├── MapStyles.js
    └── PerfilStyles.js
```

---

## 📅 7. Plan de Implementación Paso a Paso

1. **Fase 1 - Capa de Datos y Servicios:**
   * Crear [`src/services/reportService.js`](file:///C:/Users/isft118/Desktop/Software%202do/tpi-moviles-2/src/services/reportService.js) con las funciones:
     * `createReport(reportData)`
     * `getUserReports(userId)`
     * `getAllReports()` (para el mapa)
     * `updateReport(reportId, fieldsToUpdate)`
     * `deleteReport(reportId)`
   * Actualizar [`firestore.rules`](file:///C:/Users/isft118/Desktop/Software%202do/tpi-moviles-2/firestore.rules) para proteger la colección `reportes`.

2. **Fase 2 - Pantalla de Nuevo Reporte (`AddReportScreen`):**
   * Integrar el formulario con captura de GPS (`locationService.js`) y captura de imagen (`ImageService.js`).
   * Guardar el reporte en Firestore y redirigir con notificación de éxito.

3. **Fase 3 - Pantalla de Gestión de Reportes (`ReportsScreen`):**
   * Listar los reportes del usuario.
   * Implementar cambio de estado ("Resuelto" / "Cancelado") y borrado.

4. **Fase 4 - Pantalla de Mapa Comunitario (`MapScreen`):**
   * Cargar todos los reportes desde Firestore.
   * Renderizar los marcadores con sus coordenadas y callouts informativos.

5. **Fase 5 - Pantalla de Inicio y Perfil (`HomeScreen` y `PerfilScreen`):**
   * Actualizar el Dashboard con métricas de reportes y enlaces directos.
   * Ajustar la pantalla de perfil para reflejar la identidad del usuario y sus estadísticas.

6. **Fase 6 - Documentación y Verificación:**
   * Actualizar el [`README.md`](file:///C:/Users/isft118/Desktop/Software%202do/tpi-moviles-2/README.md) con la descripción completa, capturas y guía de ejecución.
   * Probar el aislamiento de datos con dos usuarios distintos para certificar las Security Rules.
