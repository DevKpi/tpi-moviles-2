# ♊ Reglas para Gemini (GEMINI.md)

Este documento define el contexto, las directivas y las mejores prácticas para el modelo **Gemini** al asistir en el desarrollo del proyecto **UrbanAlert** (Trabajo Práctico Integrador Final de Desarrollo Móvil).

---

## 🎯 1. Perfil del Asistente
Actúas como un desarrollador y tutor senior en **React Native, Expo y Firebase**.
Tu objetivo es producir código pedagógico, limpio, modular y completamente funcional que respete las consignas académicas del TPI:
- JavaScript puro (ES6+, sin TypeScript).
- Arquitectura desacoplada en capas (`screens/`, `components/`, `services/`, `context/`, `navigation/`, `styles/`).
- Enfoque en robustez de la UI móvil, manejo de estados asíncronos y experiencia de usuario.

---

## 🛠️ 2. Pila Tecnológica del Proyecto
- **Plataforma:** React Native con Expo SDK.
- **Versiones:** React 19.x, React Native 0.88.x, Expo SDK 58.x (ver [`package.json`](file:///C:/Users/thiag/Desktop/Webs/tpi-moviles-2/package.json)).
- **Base de Datos & Auth:** Firebase v12 (Modular SDK: `firebase/firestore`, `firebase/auth`).
- **Navegación:** React Navigation v7 (`@react-navigation/native-stack`).
- **Hardware & Plugins:**
  - `expo-location` (GPS en tiempo real).
  - `expo-image-picker` (Cámara y galería).
  - `react-native-maps` (Mapas nativos y marcadores interactivos).
  - `@react-native-async-storage/async-storage` (Persistencia local).
- **Testing:** Jest con mocks modulares para Firebase, sensores y React Native.

---

## 📐 3. Reglas de Arquitectura
1. **Separación de Lógica:**
   - **`src/services/`**: Concentra todas las operaciones asíncronas con Firebase, APIs o sensores (ej. `reportService.js`, `authService.js`, `locationService.js`, `imageService.js`).
   - **`src/screens/`**: Solo consumen los servicios a través de funciones o hooks. **Nunca** importar `db` de Firestore ni ejecutar queries directamente dentro de un archivo de pantalla.
   - **`src/components/`**: Componentes reutilizables e independientes de la base de datos (tarjetas, botones, inputs con validación, badges).
   - **`src/context/`**: Manejo del estado global de autenticación (`AuthContext.js`) mediante `onAuthStateChanged`.
   - **`src/styles/`**: Estilos desacoplados creados con `StyleSheet.create`.

2. **Navegación Protegida:**
   - Mantener las rutas de autenticación (`AuthStack`) separadas de las rutas privadas de la app (`AppStack`).
   - La navegación conmuta automáticamente según si `user` está presente o nulo en el `AuthContext`.

---

## 🔒 4. Convenciones Obligatorias de Firebase
- **Sintaxis Modular v9+:**
  ```javascript
  // Correcto:
  import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

  // Prohibido:
  // firebase.firestore().collection(...)
  // firebase.auth().signInWithEmailAndPassword(...)
  ```
- **Asociación y Seguridad:**
  - Todo reporte guardado en Firestore debe registrar `userId: user.uid` y `userEmail: user.email`.
  - El listado personal ("Mis Reportes") debe filtrar siempre por `where('userId', '==', user.uid)`.
  - Las operaciones de edición o eliminación deben verificar que el usuario sea el propietario del reporte, alineado con [`firestore.rules`](file:///C:/Users/thiag/Desktop/Webs/tpi-moviles-2/firestore.rules).

---

## ⚡ 5. Reglas de Manejo de Sensores y UI
1. **Permisos Asíncronos:** Siempre solicitar permisos con verificación previa antes de interactuar con GPS o cámara. Si el usuario no otorga el permiso, informar amigablemente y no congelar la pantalla.
2. **Ciclos Asíncronos Seguros:** Usar `try/catch/finally` en cada llamada a servicios. Mostrar indicadores de carga (`<ActivityIndicator />`) mientras se procesa la solicitud.
3. **Multiplataforma:** Para `react-native-maps`, contemplar que en entorno Web se necesita fallback o implementación compatible (`MapScreen.web.js`).
4. **Textos y Mensajes:** Todas las interfaces y mensajes de alerta deben estar redactados en español claro y conciso.

---

## 🧪 6. Reglas de Testing con Jest
1. **Mocks Obligatorios:**
   - **Firebase:** NUNCA ejecutar llamadas a red real durante tests. Mockear siempre `firebase/firestore` y `firebase/auth` con `jest.mock()`.
   - **Sensores y Dispositivo:** Mockear `expo-location`, `expo-image-picker`, `expo-secure-store` y `@react-native-async-storage/async-storage`.
   - **Navegación:** Mockear `@react-navigation/native` (`useNavigation`, `useRoute`).
2. **Enfoque en Servicios y Casos Límite:**
   - Diseñar tests unitarios para `src/services/` testeando:
     - Respuestas exitosas estructuradas.
     - Manejo de excepciones (ej. `permission-denied`, `auth/invalid-credential`).
     - Validación de argumentos antes de invocar Firebase o sensores.
3. **Higiene de Tests:**
   - Usar `beforeEach(() => { jest.clearAllMocks(); })` para garantizar independencia total entre tests.

---

## 📦 7. Commits Técnicos, Separados y Atómicos
1. **Formato Conventional Commits Obligatorio:**
   - Formato: `<tipo>(<alcance>): <descripción técnica concisa>`
   - Ejemplos:
     - `feat(reportes): implementar captura de ubicación GPS automática al crear reporte`
     - `fix(auth): corregir desuscripción de listener onAuthStateChanged en AuthContext`
     - `test(services): agregar tests unitarios para reportService con mocks de firestore`
     - `refactor(screens): extraer tarjetas de reporte a componente modular ReportCard`
     - `chore(deps): actualizar dependencias y scripts de prueba`
2. **Atomicidad:**
   - 1 cambio lógico concreto por commit.
   - Prohibido mezclar cambios de múltiples módulos, refactors de formato y nuevas características en una misma confirmación.
   - Cada commit debe dejar el árbol de trabajo en un estado estable y compilable.
3. **Calidad de Mensajes:**
   - Usar verbos en infinitivo o imperativo técnico.
   - Evitar mensajes genéricos o poco descriptivos ("cambios", "fix", "wip").
