# **🏗️ Trabajo Práctico Integrador Final**

## **🎯 ¿Qué vamos a hacer esta semana?**

Durante las últimas clases aprendimos a trabajar con Firebase, autenticación, persistencia remota, imágenes, GPS, mapas y APIs REST.

Ahora vamos a integrar esos conocimientos en un proyecto que represente una aplicación móvil real.

El objetivo no es aprender una biblioteca nueva, sino utilizar correctamente las herramientas que ya conocemos para resolver un problema concreto.

## **📚 ¿Qué es un Trabajo Práctico Integrador?**

Un Trabajo Práctico Integrador (TPI) es una actividad que combina diferentes contenidos aprendidos durante una materia para resolver un problema más amplio.

A diferencia de los ejercicios individuales, un TPI no busca comprobar solamente si sabemos utilizar una función.

Saber utilizar `useState` es importante, pero una aplicación real necesita mucho más.

                   `📱 Aplicación móvil`  
           `┌──────────────┼──────────────┐`  
           `↓                 ↓                 ↓`  
       `🎨 Interfaz      🧭 Navegación   🧠 Estado`                                               
           `└──────────────┼──────────────┘`  
                             `↓`  
                       `⚙️ Servicios`                            
           `┌──────────────┼──────────────┐`  
           `↓                 ↓                 ↓`  
       `🔐 Firebase     📍 Dispositivo   🌐 API REST`                               
      `┌────┴────┐       ┌──┴──┐`  
      `↓           ↓       ↓       ↓`  
   `Firestore   Storage   GPS  Cámara`

El desafío consiste en conseguir que esas partes trabajen juntas de manera coherente.

## **🧩 ¿Qué problema vamos a resolver?**

Cada grupo podrá proponer una aplicación, siempre que cumpla los requisitos técnicos establecidos.

No es necesario que todos desarrollen la misma idea.

Por ejemplo:

**📝 Gestor de tareas**

Usuarios autenticados que crean, modifican y organizan tareas personales, con imágenes adjuntas o información externa.

**📍 Mis lugares favoritos**

Aplicación que permite registrar lugares visitados, guardar coordenadas y visualizar marcadores en un mapa.

**📚 Biblioteca personal**

Aplicación para organizar libros, registrar lecturas y consultar información desde una API pública.

Estas son ideas orientativas. Los grupos pueden presentar otras propuestas, siempre que sean viables dentro del tiempo disponible.

## **🏗️ ¿Qué es un MVP?**

Antes de empezar, necesitamos recuperar un concepto importante: el Producto Mínimo Viable, o MVP.

Un MVP es una versión inicial de un producto que contiene las funcionalidades esenciales necesarias para aportar valor y comprobar su utilidad.

No significa hacer una aplicación incompleta o descuidada.

Significa priorizar lo importante.

### **📝 Ejemplo: gestor de tareas**

✅ MVP

Registro e inicio de sesión, crear tareas, listar tareas, editarlas, eliminarlas y cerrar sesión.

🚀 Funciones futuras

Notificaciones, calendario avanzado, inteligencia artificial, colaboración y estadísticas.

Para este trabajo, una aplicación sencilla que funciona correctamente tendrá más valor que una aplicación enorme con pantallas que no funcionan.

## **📋 Consigna del Trabajo Práctico Integrador Final**

### **🎯 Objetivo general**

Desarrollar una aplicación móvil funcional utilizando React Native, Expo y JavaScript, integrando contenidos del primer y segundo cuatrimestre.

El proyecto deberá representar una solución a una necesidad concreta, contar con persistencia remota y demostrar el uso correcto de los conceptos trabajados en clase.

### **👥 Modalidad**

* Grupos de 2 o 3 integrantes.  
* Desarrollo utilizando un repositorio compartido de GitHub.  
* Participación comprobable de cada integrante.  
* Entrega del código fuente y un archivo `README.md`.  
* Presentación y defensa oral del proyecto.

## **✅ Requisitos obligatorios**

**📱 A. Interfaz y navegación**

La aplicación deberá tener al menos tres pantallas funcionales, componentes reutilizables, formularios, uso de State y navegación entre pantallas.

**🔐 B. Autenticación**

Registro, inicio y cierre de sesión con Firebase Authentication. Las pantallas privadas deberán estar protegidas y la sesión deberá gestionarse correctamente.

**☁️ C. Persistencia remota**

Utilizar Cloud Firestore para implementar un CRUD completo sobre la entidad principal del proyecto: crear, consultar, editar y eliminar registros.

**👤 D. Datos por usuario y seguridad**

Los registros deberán estar asociados al usuario autenticado mediante su `uid`. Las consultas y Security Rules deberán impedir el acceso no autorizado a información privada.

**🏗️ E. Organización del código**

Separar pantallas, componentes, configuración y servicios. No concentrar toda la lógica en un único archivo.

**🌿 F. Git y GitHub**

El repositorio deberá contener commits significativos de los integrantes, documentación de instalación y descripción de las funcionalidades implementadas.

## **📲 Funcionalidades complementarias**

Además de los requisitos obligatorios, cada grupo deberá implementar al menos una de las siguientes integraciones, de acuerdo con la naturaleza de su proyecto.

**🖼️ Opción A — Imágenes**

Seleccionar ,almacenar su URI en localmente. Por ejemplo, una foto de perfil o una imagen asociada a un registro.

**📍 Opción B — GPS y mapas**

Obtener la ubicación mediante `expo-location` y mostrarla en un mapa con `react-native-maps`. Puede incluir marcadores de lugares registrados.

**🌐 Opción C — API REST**

Consultar una API externa utilizando `fetch()`, mostrar los resultados y gestionar correctamente los estados de carga y error.

Se pueden combinar varias opciones, pero no será obligatorio implementar las tres.

**💡 Importante:** una funcionalidad complementaria deberá estar integrada de manera coherente. Por ejemplo, no alcanza con agregar un mapa vacío o una pantalla que solamente muestre una imagen fija.

## **🧠 ¿Cómo organizamos el desarrollo?**

Antes de escribir código, cada grupo deberá definir qué aplicación va a construir.

### **📝 Paso 1 — Definir la idea**

Responder:

* ¿Cómo se llama la aplicación?  
* ¿Qué problema resuelve?  
* ¿Quiénes la utilizarán?  
* ¿Qué funcionalidades tendrá?  
* ¿Cuál será la entidad principal que se guardará en Firestore?

### **🧭 Paso 2 — Diseñar las pantallas**

Por ejemplo, para un gestor de tareas:

`📱 Aplicación`  
      `│`  
      `├── 🔐 Login`  
      `├── 📝 Registro`  
      `│`  
      `└── 🔓 Zona privada`  
              `├── 🏠 Inicio`  
              `├── 📋 Mis tareas`  
              `├── ➕ Crear tarea`  
              `├── ✏️ Editar tarea`  
              `└── 👤 Perfil`

No es necesario que todas las pantallas sean complejas.

Sí es importante que tengan una finalidad clara.

### **☁️ Paso 3 — Diseñar los datos**

Antes de crear documentos en Firestore, definir qué información necesitan almacenar.

Por ejemplo:

`{`  
  `titulo: 'Preparar presentación',`  
  `descripcion: 'Preparar defensa del TPI',`  
  `completada: false,`  
  `userId: 'UID_DEL_USUARIO'`  
`}`

En este caso, la colección podría llamarse:

`tareas/`  
   `├── documento1`  
   `├── documento2`  
   `└── documento3`

### **🏗️ Paso 4 — Organizar el proyecto**

Una estructura posible, siguiendo la arquitectura utilizada en nuestras prácticas, sería:

`src/`  
`│`  
`├── components/`  
`│   ├── TaskCard.js`  
`│   └── CustomButton.js`  
`│`  
`├── context/`  
`│   └── AuthContext.js`  
`│`  
`├── firebase/`  
`│   └── firebase.js`  
`│`  
`├── navigation/`  
`│   ├── AppNavigator.js`  
`│   ├── AuthStack.js`  
`│   └── AppStack.js`  
`│`  
`├── screens/`  
`│   ├── LoginScreen.js`  
`│   ├── RegisterScreen.js`  
`│   ├── HomeScreen.js`  
`│   ├── TaskListScreen.js`  
`│   └── ProfileScreen.js`  
`│`  
`└── services/`  
    `├── authService.js`  
    `├── taskService.js`  
    `└── userService.js`

Esta estructura es orientativa. No se evaluará que todos tengan exactamente las mismas carpetas, sino que el código esté organizado y sus responsabilidades sean comprensibles.

## **⚠️ Errores comunes que debemos evitar**

### **❌ Intentar desarrollar demasiadas funcionalidades**

Es preferible entregar cinco funcionalidades completas que diez incompletas.

### **❌ No comprobar las reglas de seguridad**

Que un usuario solamente vea sus propios registros en la interfaz no significa que Firestore esté protegido.

### **❌ Colocar toda la lógica en las pantallas**

Una pantalla no debería concentrar autenticación, consultas a Firestore, navegación y procesamiento de imágenes sin una separación razonable.

### **❌ Dejar todo el trabajo para el último día**

Esto dificulta las pruebas, la corrección de errores y la colaboración.

### **❌ Hacer un único commit con todo el proyecto**

GitHub debe reflejar el proceso de desarrollo. No solamente servir para subir la entrega final.

### **❌ No probar con distintos usuarios**

Una aplicación puede funcionar correctamente con una sola cuenta y presentar problemas cuando se registra un segundo usuario.

## **📊 ¿Cómo se evaluará el Trabajo Práctico Integrador?**

La evaluación tendrá en cuenta tanto el funcionamiento de la aplicación como la calidad del desarrollo y la capacidad de explicar las decisiones tomadas.

## **🎤 ¿Cómo será la defensa oral?**

Cada grupo deberá presentar la aplicación funcionando y explicar cómo está construida.

No alcanza con demostrar que los botones funcionan. También es necesario comprender el código desarrollado.

## **🌿 Entrega mediante GitHub**

El repositorio deberá incluir:

`📁 repositorio/`  
`│`  
`├── 📁 src/`  
`├── 📁 assets/`  
`├── 📄 package.json`  
`├── 📄 app.json`  
`├── 📄 README.md`  
`└── 📄 .gitignore`

El `README.md` deberá explicar el nombre y objetivo de la aplicación, sus principales funcionalidades, las tecnologías utilizadas, cómo instalarla y ejecutarla, quiénes participaron y qué limitaciones conocidas tiene.

No deberán incluir contraseñas, claves privadas ni credenciales de servicio en el repositorio.

## **📚 Documentación de consulta**

Para resolver dudas durante el desarrollo, pueden recurrir a las siguientes fuentes oficiales:

* 📱 [React Native — Documentación](https://reactnative.dev/docs/getting-started?utm_source=chatgpt.com)  
* ⚙️ [Expo — Documentación](https://docs.expo.dev/?utm_source=chatgpt.com)  
* 🧭 [React Navigation](https://reactnavigation.org/docs/getting-started/?utm_source=chatgpt.com)  
* 🔐 [Firebase Authentication](https://firebase.google.com/docs/auth?utm_source=chatgpt.com)  
* ☁️ [Cloud Firestore](https://firebase.google.com/docs/firestore?utm_source=chatgpt.com)  
* 🖼️ [Firebase Storage](https://firebase.google.com/docs/storage?utm_source=chatgpt.com)  
* 📍 [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/?utm_source=chatgpt.com)  
* 🗺️ [React Native Maps](https://github.com/react-native-maps/react-native-maps?utm_source=chatgpt.com)  
* 🌐 [React Native — Networking](https://reactnative.dev/docs/network?utm_source=chatgpt.com)