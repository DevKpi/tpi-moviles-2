# Plan de trabajo — UrbanAlert

## Objetivo

Organizar el desarrollo del TPI entre **Thiago** y **Esteban** para que puedan avanzar en paralelo, con responsables claros por archivo y una integración ordenada.

Este plan cubre interfaz, navegación, reportes, mapas y funciones del dispositivo. **Firebase queda fuera de este reparto** y deberá coordinarse por separado.

## Punto de partida

- Las pantallas de UrbanAlert en `src/screens/` están creadas, pero vacías.
- `src/screens_old/` contiene pantallas del prototipo anterior. Pueden consultarse como referencia, pero las nuevas funcionalidades deben implementarse en `src/screens/`.
- Ya existen servicios de ubicación, selección de imágenes y almacenamiento local que pueden revisarse y reutilizarse.
- La navegación actual todavía mezcla pantallas nuevas con pantallas antiguas; la integración de rutas tiene un responsable único en este plan.
- Las dependencias principales de Expo, navegación, mapas, ubicación y selección de imágenes ya figuran en `package.json`.

## Reparto de tareas

### Thiago — Estructura de la app y experiencia de cuenta

Thiago es responsable del esqueleto de navegación y de las pantallas generales de la aplicación.

- [x] Implementar la interfaz de `LoginScreen` y `RegisterScreen`, con validaciones de formulario y estados de carga/error. La conexión con autenticación queda fuera de este plan.
- [x] Implementar `HomeScreen` como dashboard y acceso a las secciones principales: nuevo reporte, mis reportes, mapa y perfil.
- [x] Implementar `PerfilScreen` para mostrar la información de cuenta disponible y permitir seleccionar/ver la foto de perfil.
- [x] Consumir el servicio de selección de imágenes acordado con Esteban y guardar la URI del avatar con `storageService.js`.
- [ ] Ser el único responsable de `src/navigation/AppNavigation.js`, `src/navigation/AuthStack.js` y `src/navigation/AppStack.js`.
- [ ] Acordar y registrar los nombres de rutas: `Login`, `Registro`, `Inicio`, `NuevoReporte`, `MisReportes`, `Mapa` y `Perfil`.
- [x] Crear componentes comunes de interfaz en `src/components/`, por ejemplo botón, campo de texto, encabezado y estado de carga. Thiago administra los componentes genéricos; Esteban administra los componentes propios de reportes.
- [x] Crear estilos nuevos para UrbanAlert sin reutilizar ni modificar los estilos del prototipo antiguo.
- [ ] Actualizar `app.json` y `README.md` para que describan UrbanAlert y las instrucciones reales del proyecto.
- [ ] Preparar la configuración de Jest compatible con Expo y el script de pruebas del proyecto, sin incluir pruebas que dependan de Firebase.

**Archivos bajo responsabilidad de Thiago:**

- `App.js` y `app.json`
- `src/navigation/*`
- `src/screens/LoginScreen.js`
- `src/screens/RegisterScreen.js`
- `src/screens/HomeScreen.js`
- `src/screens/PerfilScreen.js`
- Componentes genéricos y sus estilos nuevos
- `src/services/storageService.js` para el avatar local
- `README.md`, configuración de Jest y cambios en `package.json`/`package-lock.json`

### Esteban — Reportes, mapas y funciones del dispositivo

Esteban es responsable del flujo principal de reclamos y de las integraciones locales con GPS, cámara y galería.

- [ ] Implementar `AddReportScreen.js` con título, descripción, selección de categoría, ubicación, foto, validaciones y estados de carga/error.
- [ ] Implementar `ReportsScreen.js` con estados de carga, error y lista vacía; mostrar los reportes y ofrecer las acciones acordadas para editar, cancelar y eliminar.
- [ ] Implementar `MapScreen.js` para Android/iOS con marcadores de reportes que tengan coordenadas y una vista informativa al seleccionar un marcador.
- [ ] Implementar `MapScreen.web.js` como alternativa web estable, mostrando la información de ubicación y una opción para abrirla en un servicio de mapas si no hay mapa integrado.
- [ ] Revisar y mantener `locationService.js`: permisos, GPS desactivado, errores y liberación de suscripciones si se utiliza seguimiento continuo.
- [ ] Revisar y mantener `ImageService.js`: permisos de cámara/galería, cancelación, errores y devolución de la URI seleccionada.
- [ ] Crear componentes específicos de reportes, por ejemplo `ReportCard`, `StatusBadge` y selector de categorías.
- [ ] Crear estilos nuevos para formulario, listado y mapa de UrbanAlert, sin modificar los estilos usados por `screens_old/`.
- [ ] Agregar pruebas unitarias para validaciones y servicios locales de ubicación/imágenes, con mocks de hardware según `AGENTS.md`.

**Archivos bajo responsabilidad de Esteban:**

- `src/screens/AddReportScreen.js`
- `src/screens/ReportsScreen.js`
- `src/screens/MapScreen.js` y `src/screens/MapScreen.web.js`
- `src/services/locationService.js` y `src/services/ImageService.js`
- Componentes específicos de reportes y sus estilos nuevos
- Pruebas de validaciones y servicios locales de su dominio

## Acuerdos compartidos antes de empezar

Thiago y Esteban deben cerrar estos puntos en una conversación breve y mantener la misma decisión en ambas ramas:

1. **Datos que usa la interfaz:** acordar los campos de negocio del reporte: `id`, `titulo`, `descripcion`, `categoria`, `estado`, `fotoUri`, `coordenadas` y `fechaCreacion`.
2. **Categorías:** usar las definidas en la especificación: Baches y Calzada, Iluminación Pública, Semáforos, Basura y Residuos, Arbolado y Espacios Verdes, y Otros.
3. **Estados:** usar Pendiente, En revisión, Resuelto y Cancelado.
4. **Ubicación sin permiso o sin señal:** decidir si el usuario podrá seleccionar el punto en el mapa o enviar el reporte sin coordenadas. La especificación admite coordenadas nulas.
5. **Acciones del usuario:** distinguir cancelar (cambiar estado) de eliminar (borrar) y acordar qué campos y estados puede modificar el usuario.
6. **Contrato de integración:** las pantallas de reportes deben consumir una interfaz de datos acordada. La implementación de persistencia remota no forma parte de este documento.
7. **Imágenes:** `ImageService.js` pertenece a Esteban. Debe ofrecer funciones reutilizables para galería y cámara, de modo que el formulario y el perfil puedan consumirlas sin editar el mismo archivo.

## Orden de integración

1. Ambos acuerdan el modelo de pantalla, las rutas, categorías, estados y reglas de propiedad de archivos.
2. Thiago y Esteban trabajan en ramas independientes. Esteban no modifica los archivos de navegación; Thiago no modifica las pantallas ni servicios asignados a Esteban.
3. Cada integrante completa sus pantallas y componentes de dominio. Thiago integra las rutas cuando las pantallas de Esteban estén listas.
4. Integrar y revisar el recorrido completo: acceso, inicio, alta de reporte, listado, mapa y perfil.
5. Completar la documentación y las pruebas de las funciones incluidas en este reparto.
6. Coordinar por separado la autenticación y persistencia remota que quedaron fuera del alcance de este plan.

## Criterios de cierre

- Las rutas acordadas están conectadas y llevan a pantallas de UrbanAlert, sin depender de pantallas de `screens_old/`.
- Los formularios informan errores de validación y no permiten envíos duplicados mientras cargan.
- Los permisos denegados, la ubicación desactivada y la cancelación de selección de imagen tienen un resultado claro para el usuario.
- La lista contempla carga, error y estado vacío; cancelar y eliminar son acciones diferenciadas.
- El mapa nativo muestra reportes con coordenadas y la alternativa web funciona sin importar el mapa nativo.
- Los componentes comunes y específicos mantienen responsabilidades separadas.
- El README describe el nombre, objetivo, funciones y ejecución actuales de UrbanAlert.
- Las pruebas automatizadas no dependen de red, Firebase ni hardware real.

## Git y prevención de conflictos

- Thiago trabaja en `feat/thiago-app-shell` y Esteban en `feat/esteban-reportes-mapas`, ambas ramas basadas en `main` actualizado.
- No trabajar simultáneamente sobre la misma copia local del repositorio.
- No hacer commits directos a `main`; integrar mediante pull requests pequeños.
- Respetar el responsable de cada archivo de este documento. En particular, solo Thiago edita navegación y configuración global; solo Esteban edita los servicios de ubicación e imágenes.
- Usar Conventional Commits como indica `AGENTS.md`, por ejemplo `feat(navigation): conectar rutas de UrbanAlert` o `feat(reportes): implementar formulario de reclamos`.
- Si aparece la necesidad de una dependencia nueva, Thiago centraliza el cambio en `package.json` y `package-lock.json` para evitar conflictos.

## Fuera del alcance

La configuración de Firebase, autenticación, persistencia remota, reglas de seguridad y cualquier decisión del proyecto Firebase no se asignan aquí. Se deben acordar e integrar en una etapa separada.
