# 🏙️ UrbanAlert - Sistema de Reporte de Reclamos e Incidentes Urbanos

Aplicación móvil desarrollada con **React Native** y **Expo (SDK 58)** para el Trabajo Práctico Integrador Final de Desarrollo Móvil. Permite a los ciudadanos registrar, consultar y visualizar en un mapa reclamos e incidentes urbanos (baches, iluminación, semáforos, residuos, arbolado, entre otros).

---

## 🚀 Características Principales

- 🔐 **Acceso y Cuenta de Usuario**: Pantallas de inicio de sesión, registro y perfil con gestión de avatar local.
- 🧭 **Navegación Protegida**: Separación entre rutas públicas (`Login`, `Registro`) y privadas (`Inicio`, `NuevoReporte`, `MisReportes`, `Mapa`, `Perfil`) mediante **React Navigation v7**.
- 📝 **Gestión de Reclamos**: Creación de reportes con categoría, descripción, fotografía y ubicación geográfica.
- 🗺️ **Visualización en Mapa**: Mapa interactivo con marcadores en Android/iOS (`react-native-maps`) y vista alternativa compatible para entorno Web.
- 📍 **Hardware y Sensores**: Integración con cámara/galería (`expo-image-picker`), GPS (`expo-location`) y almacenamiento local (`@react-native-async-storage/async-storage`, `expo-secure-store`).
- 🧪 **Testing Unitario**: Configuración de pruebas con **Jest** y `jest-expo` mediante mocks locales sin depender de red ni hardware real.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [React Native](https://reactnative.dev/) (0.88.x) / [Expo](https://expo.dev/) (SDK 58) / React 19
- **Navegación:** [React Navigation v7](https://reactnavigation.org/) (`@react-navigation/native`, `@react-navigation/native-stack`)
- **Backend & Auth:** [Firebase v12](https://firebase.google.com/) (SDK modular)
- **Mapas y Sensores:** `react-native-maps`, `expo-location`, `expo-image-picker`
- **Almacenamiento Local:** `@react-native-async-storage/async-storage`, `expo-secure-store`
- **Testing:** `jest`, `jest-expo`

---

## 📁 Estructura del Proyecto

```text
tpi-moviles-2/
├── assets/                    # Íconos, splash screen y recursos gráficos
├── src/
│   ├── components/            # Componentes reutilizables de UI
│   ├── context/               # Contexto global de autenticación (AuthContext)
│   ├── firebase/              # Inicialización y servicios de Firebase
│   ├── navigation/            # AppNavigation, AuthStack y AppStack
│   ├── screens/               # Pantallas principales de UrbanAlert
│   ├── services/              # Servicios de ubicación, imágenes y almacenamiento
│   └── styles/                # Hojas de estilo desacopladas (StyleSheet)
├── App.js                     # Componente raíz de la aplicación
├── app.json                   # Configuración del proyecto Expo (UrbanAlert)
├── index.js                   # Punto de entrada de Expo
├── package.json               # Dependencias y scripts del proyecto
└── README.md                  # Documentación del proyecto
```

---

## 📋 Requisitos Previos

- **Node.js** (versión LTS recomendada, v18 o superior)
- **Git**
- **Expo Go** en dispositivo móvil o emulador/simulador configurado (Android Studio / Xcode)

---

## ⚙️ Instalación y Ejecución

1. **Clonar el repositorio e ingresar al directorio:**

```bash
git clone <URL_DEL_REPOSITORIO>
cd tpi-moviles-2
```

2. **Instalar las dependencias:**

```bash
npm install
```

3. **Iniciar el servidor de desarrollo de Expo:**

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

## 👥 Autores

Trabajo Práctico Integrador Final — Desarrollo Móvil (**UrbanAlert**).
