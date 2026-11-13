# 🏙️ UrbanAlert - Sistema de Reporte de Reclamos e Incidentes Urbanos

Aplicación móvil desarrollada con **React Native** y **Expo (SDK 58)** para el **Trabajo Práctico Integrador Final** de Desarrollo Móvil.

## 🎯 Objetivo

Brindar a los ciudadanos una herramienta simple y centralizada para registrar, consultar, actualizar y visualizar en un mapa comunitario reclamos e incidentes urbanos (baches, iluminación pública, semáforos, residuos, arbolado, entre otros), con autenticación de usuarios y persistencia remota segura en Cloud Firestore.

---

## 🚀 Principales Funcionalidades

- 🔐 **Autenticación y Perfil**: Registro, inicio de sesión, cierre de sesión con **Firebase Authentication**, gestión de datos del usuario en Firestore (`usuarios`) y foto de perfil almacenada localmente.
- 🧭 **Navegación Protegida**: Separación reactiva entre rutas públicas (`Login`, `Registro`) y privadas (`Inicio`, `NuevoReporte`, `MisReportes`, `Mapa`, `Perfil`) mediante **React Navigation v7** y `AuthContext`.
- 📝 **CRUD Completo de Reportes**:
  - Alta de reclamos en Firestore (`reportes`) con título, descripción, categoría, coordenadas GPS y fotografía local.
  - Listado personal de reportes con filtrado, edición de datos, cancelación de reportes pendientes/en revisión y eliminación.
- 🗺️ **Mapa Comunitario**: Visualización geográfica de incidentes con marcadores interactivos en Android/iOS (`react-native-maps`) y vista alternativa compatible para Web (`MapScreen.web.js`).
- 📍 **Hardware y Sensores**: Integración con cámara/galería (`expo-image-picker`), GPS en tiempo real (`expo-location`) y almacenamiento local (`@react-native-async-storage/async-storage`, `expo-secure-store`).
- 🛡️ **Seguridad en Firestore**: Reglas en `firestore.rules` que exigen autenticación, asocian cada documento a `userId`, validan campos/categorías/estados y restringen edición y borrado al propietario.
- 🧪 **Testing Unitario**: Suite de pruebas con **Jest** y `jest-expo` mediante mocks locales de Firebase, sensores y almacenamiento.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [React Native](https://reactnative.dev/) (0.88.x) / [Expo](https://expo.dev/) (SDK 58) / React 19
- **Navegación:** [React Navigation v7](https://reactnavigation.org/) (`@react-navigation/native`, `@react-navigation/native-stack`)
- **Backend & Auth:** [Firebase v12](https://firebase.google.com/) (SDK modular: `firebase/auth`, `firebase/firestore`)
- **Mapas y Sensores:** `react-native-maps`, `expo-location`, `expo-image-picker`
- **Almacenamiento Local:** `@react-native-async-storage/async-storage`, `expo-secure-store`
- **Testing:** `jest`, `jest-expo`
- **Build & Distribución:** EAS Build (`eas.json`)

---

## 📁 Estructura del Proyecto

```text
tpi-moviles-2/
├── assets/                    # Íconos, splash screen y recursos gráficos
├── src/
│   ├── __tests__/             # Tests unitarios globales
│   ├── components/            # Componentes reutilizables de UI
│   ├── constants/             # Constantes de dominio (categorías, estados, validaciones)
│   ├── context/               # Contexto global de autenticación (AuthContext)
│   ├── firebase/              # Inicialización modular de Firebase
│   ├── navigation/            # AppNavigation, AuthStack y AppStack
│   ├── screens/               # Pantallas principales de UrbanAlert
│   ├── services/              # Servicios de reportes, usuarios, ubicación, imágenes y almacenamiento
│   ├── styles/                # Hojas de estilo desacopladas (StyleSheet)
│   └── utils/                 # Utilidades auxiliares
├── .env.example               # Plantilla de variables de entorno de Firebase
├── App.js                     # Componente raíz de la aplicación
├── app.json                   # Configuración del proyecto Expo (UrbanAlert)
├── eas.json                   # Perfiles de compilación con EAS Build
├── firestore.rules            # Reglas de seguridad de Cloud Firestore
├── index.js                   # Punto de entrada de Expo
├── package.json               # Dependencias y scripts del proyecto
└── README.md                  # Documentación del proyecto
```

---

## 📋 Requisitos Previos

- **Node.js** (versión LTS recomendada, v18 o superior)
- **Git**
- **Proyecto Firebase** con Authentication (Email/Password) y Cloud Firestore habilitados
- **Expo Go** en dispositivo móvil o emulador/simulador configurado (Android Studio / Xcode)

---

## ⚙️ Instalación y Ejecución

1. **Clonar el repositorio e ingresar al directorio:**

```bash
git clone https://github.com/DevKpi/tpi-moviles-2.git
cd tpi-moviles-2
```

2. **Instalar las dependencias:**

```bash
npm install
```

3. **Configurar las variables de entorno:**

Copiar `.env.example` como `.env.local` y completar con las credenciales públicas del proyecto Firebase:

```bash
cp .env.example .env.local
```

4. **Iniciar el servidor de desarrollo de Expo:**

```bash
npm start
```

### Opciones de visualización
- **Dispositivo físico:** Abrir **Expo Go** y escanear el código QR mostrado en la terminal.
- **Android Emulator:** Presionar `a` en la terminal o ejecutar `npm run android`.
- **iOS Simulator** (solo macOS): Presionar `i` en la terminal o ejecutar `npm run ios`.
- **Web:** Presionar `w` en la terminal o ejecutar `npm run web`.

---

## 📜 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo de Expo.
- `npm run android`: Inicia la aplicación en un emulador o dispositivo Android.
- `npm run ios`: Inicia la aplicación en el simulador de iOS.
- `npm run web`: Inicia la aplicación en el navegador web local.
- `npm test`: Ejecuta la suite de pruebas unitarias con Jest.

---

## ⚠️ Limitaciones Conocidas

- **Imágenes locales:** Las fotografías adjuntas a los reportes y el avatar de perfil se almacenan mediante su **URI local** en el dispositivo (no se suben a Firebase Storage), por lo que las imágenes creadas en un dispositivo no se visualizan desde otro dispositivo distinto.
- **Mapas en entorno Web:** `react-native-maps` no tiene soporte nativo en navegador; en Web se muestra una vista alternativa (`MapScreen.web.js`).
- **Transiciones de estado administrativas:** Por reglas de seguridad (`firestore.rules`), desde la app cliente el usuario creador puede crear reportes en estado `Pendiente`, editarlos mientras estén en `Pendiente` o `En revisión`, o pasarlos a `Cancelado`. Los cambios a `En revisión` o `Resuelto` quedan reservados para gestión administrativa externa.
- **Reglas de Firestore pendientes de despliegue:** El archivo `firestore.rules` se encuentra versionado en el repositorio y debe aplicarse manualmente desde Firebase Console o Firebase CLI sobre el proyecto destino.

---

## 👥 Participantes

- **Thiago** (`DevKpi`)
- **Esteban** (`Tekobc`)

Trabajo Práctico Integrador Final — Desarrollo Móvil (**UrbanAlert**).
