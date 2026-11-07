# 🤖 Reglas Generales para Asistentes de IA (AGENTS.md)

Este repositorio contiene el **Trabajo Práctico Integrador (TPI) Final** de la materia Desarrollo Móvil: **UrbanAlert** (Sistema de Reporte de Reclamos e Incidentes Urbanos).

Cualquier agente de inteligencia artificial (Antigravity, Cursor, Claude Code, Copilot, Gemini, etc.) que opere en este repositorio **DEBE** cumplir estrictamente las siguientes directivas.

---

## 📌 1. Stack Tecnológico & Entorno de Ejecución
- **Framework base:** React Native con Expo (JavaScript ES6+, sin TypeScript).
- **React / React Native:** Versiones modernas según [`package.json`](file:///C:/Users/thiag/Desktop/Webs/tpi-moviles-2/package.json) (React 19.x, React Native 0.88.x, Expo SDK 58.x).
- **Backend & Autenticación:** Firebase SDK v12 modular (`firebase/auth`, `firebase/firestore`).
- **Navegación:** `@react-navigation/native` y `@react-navigation/native-stack` (v7.x).
- **Hardware & Sensores:**
  - `expo-location` (Geolocalización GPS).
  - `expo-image-picker` (Cámara y selección de fotos).
  - `react-native-maps` (Visualización cartográfica y marcadores).
- **Persistencia local:** `@react-native-async-storage/async-storage` y `expo-secure-store`.
- **Testing:** Jest con mocks modulares para Firebase, sensores y React Native.

---

## 🏗️ 2. Arquitectura & Organización del Código
Mantener **estricta separación de responsabilidades**. No concentrar lógica en un solo archivo:

- `src/screens/`: Pantallas de la aplicación. Responsables de renderizar UI, recibir input del usuario e invocar servicios o contextos. **NO** deben contener llamadas directas al SDK de Firebase.
- `src/components/`: Componentes modulares y reutilizables (botones, tarjetas de reclamos, badges de estado, inputs, loaders, modales).
- `src/services/`: Toda la comunicación con APIs externas, Firebase (`firestoreService`, `authService`, `reportService`), almacenamiento local o servicios de hardware (`locationService`, `imageService`).
- `src/context/`: Contextos de React (`AuthContext.js`) para estado global (sesión de usuario, permisos compartidos).
- `src/navigation/`: Configuración de navegación con React Navigation.
  - Separar rutas públicas (`AuthStack.js`) y privadas (`AppStack.js`).
  - La visualización de pantallas depende reactivamente del estado `user` provisto por `AuthContext`.
- `src/styles/`: Hojas de estilo desacopladas utilizando `StyleSheet.create`.

---

## 🔐 3. Reglas Críticas de Firebase & Seguridad
1. **SDK Modular Obligatorio:**
   - Usar **únicamente** la sintaxis modular de Firebase v9+:
     ```javascript
     import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
     import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
     ```
   - **PROHIBIDO** usar la sintaxis v8 namespaced (ej: `firebase.auth()`, `firebase.firestore()`).
2. **Seguridad y Asociación por Usuario (`userId`):**
   - Cada reporte/documento en Firestore **debe** incluir `userId: auth.currentUser.uid`.
   - Toda consulta debe filtrar por usuario cuando corresponda (`where('userId', '==', user.uid)`).
   - Respetar las reglas de seguridad definidas en [`firestore.rules`](file:///C:/Users/thiag/Desktop/Webs/tpi-moviles-2/firestore.rules).
3. **Credenciales:** Nunca incluir credenciales privadas o API keys en commits públicos. Usar variables de configuración seguras.

---

## 📱 4. Requisitos de Experiencia de Usuario & Hardware
1. **Permisos Asíncronos:**
   - Siempre solicitar y verificar permisos antes de usar la cámara (`ImagePicker.requestCameraPermissionsAsync()`), la galería (`requestMediaLibraryPermissionsAsync()`) o el GPS (`Location.requestForegroundPermissionsAsync()`).
   - Proveer manejo claro si el usuario deniega los permisos (alerta informativa o fallback).
2. **Estados de Carga y Errores:**
   - Toda operación asíncrona debe contemplar:
     - Estado de carga (`loading` con `ActivityIndicator` o botones deshabilitados).
     - Manejo de excepciones con bloques `try/catch/finally`.
     - Mensajes amigables de error (`Alert.alert` o textos informativos en pantalla).
3. **Compatibilidad Web:**
   - Recordar que `react-native-maps` requiere adaptación o pantalla alternativa (`MapScreen.web.js`) en entorno web. Mantener siempre la estabilidad multiplataforma.

---

## 🧪 5. Reglas de Testing con Jest
1. **Mocks Obligatorios (Sin llamados a red ni hardware real):**
   - **Firebase:** Mockear siempre `firebase/firestore` y `firebase/auth` con `jest.mock()`. Nunca ejecutar llamadas reales a Firestore durante pruebas unitarias.
   - **Sensores y Dispositivo:** Mockear `expo-location`, `expo-image-picker`, `expo-secure-store` y `@react-native-async-storage/async-storage`.
   - **Navegación:** Mockear `@react-navigation/native` (`useNavigation`, `useRoute`).
2. **Estructura y Cobertura Prioritaria:**
   - Ubicación de tests: `src/__tests__/` o junto al archivo en formato `*.test.js`.
   - Probar exhaustivamente:
     - Servicios (`src/services/`): casos de éxito, errores de conexión, payloads inválidos y respuestas simuladas de Firebase.
     - Validaciones de formulario (título obligatorio, categoría válida, formato de coordenadas).
     - Manejo de estado en contextos (`AuthContext`).
3. **Aislamiento e Independencia:**
   - Limpiar mocks antes de cada test con `beforeEach(() => { jest.clearAllMocks(); })`.
   - Cada prueba debe ser determinista, rápida y no depender del estado de otras pruebas.

---

## 📦 6. Commits Técnicos, Separados y Atómicos
1. **Convención Estricta (Conventional Commits):**
   - Estructura: `<tipo>(<alcance>): <descripción técnica concisa>`
   - Tipos permitidos:
     - `feat`: Nueva funcionalidad o componente (ej: `feat(reportes): agregar selector de categorías con chips`).
     - `fix`: Corrección de bugs o errores de lógica (ej: `fix(auth): corregir propagación de error al fallar inicio de sesión`).
     - `test`: Nuevos tests unitarios o ajustes de mocks (ej: `test(services): agregar tests unitarios para reportService con mocks de firestore`).
     - `refactor`: Refactorización interna sin cambio de comportamiento (ej: `refactor(navigation): desacoplar AppStack y AuthStack`).
     - `docs`: Modificaciones de documentación o especificación (ej: `docs(rules): actualizar directivas de agentes`).
     - `chore`: Tareas de configuración o dependencias (ej: `chore(jest): configurar jest preset y mocks globales`).
2. **Atomicidad Absoluta (1 cambio lógico = 1 commit):**
   - **PROHIBIDO** mezclar refactorizaciones, correcciones de estilo y nuevas funcionalidades en el mismo commit.
   - Los tests de una funcionalidad deben commitearse junto a ella o en un commit atómico inmediatamente posterior.
   - Cada commit debe dejar el proyecto en un estado compilable y funcional (sin código roto o tests fallidos).
3. **Mensajes Técnicos y Rigurosos:**
   - Redacción clara en español o inglés técnico en modo imperativo.
   - **PROHIBIDO** usar mensajes vagos como "cambios", "fix", "wip", "subiendo", "actualización".
   - Si el cambio requiere contexto de arquitectura, detallar en el cuerpo del commit el **qué** y el **por qué**.
