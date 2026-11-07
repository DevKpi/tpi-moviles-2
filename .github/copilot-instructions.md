# GitHub Copilot Custom Instructions for UrbanAlert (TPI Móviles 2)

## 🎯 Project Overview & Role
You are assisting in the development of **UrbanAlert**, a React Native mobile application built with **Expo (JavaScript)** for an academic final project (TPI).

The app allows citizens to report urban incidents (broken streetlights, potholes, waste, traffic lights), capture GPS coordinates, attach photos, store them in Cloud Firestore, and visualize them on an interactive map.

---

## 🛠️ Tech Stack & Constraints
- **Framework:** React Native with Expo SDK (configured in `package.json`).
- **Language:** JavaScript (ES6+), JSX. Do NOT generate TypeScript files or syntax.
- **Backend:** Firebase v12 using **Modular SDK** exclusively (`firebase/firestore`, `firebase/auth`).
- **Navigation:** `@react-navigation/native` & `@react-navigation/native-stack` (v7.x).
- **Sensors & Media:** `expo-location`, `expo-image-picker`, `react-native-maps`.
- **Local Persistence:** `@react-native-async-storage/async-storage` and `expo-secure-store`.
- **Testing:** Jest with modular mocks for Firebase, hardware sensors, and React Native.

---

## 🏛️ Architecture & Folder Conventions
Follow strict separation of concerns:
- `src/screens/`: Presentation-only screens. Handles UI layout, user input, and triggers hooks/services. **Never perform direct Firestore/Auth calls inside screen components**.
- `src/components/`: Reusable, modular UI components (e.g. `IncidentCard`, `StatusBadge`, `CustomButton`, `LoadingSpinner`).
- `src/services/`: All asynchronous API, Firebase (`authService.js`, `reportService.js`), hardware (`locationService.js`, `imageService.js`), and storage logic.
- `src/context/`: Global React Context (`AuthContext.js` managing session lifecycle with `onAuthStateChanged`).
- `src/navigation/`: Navigation container, separating `AuthStack` (public: Login, Register) and `AppStack` (private: Home, Map, Reports, Profile).
- `src/styles/`: Centralized or scoped styling using `StyleSheet.create`.

---

## ⚠️ Critical Implementation Rules

### 1. Firebase Modular Syntax
- **Always** use modular imports:
  ```javascript
  import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
  ```
- **Never** use legacy v8 syntax (e.g., `firebase.firestore()`, `firebase.auth()`).

### 2. User Data Isolation & Security
- Every user-created report document in Firestore must include `userId: auth.currentUser.uid` and `userEmail`.
- Queries fetching user records must filter by `where('userId', '==', user.uid)`.
- Follow and respect the security boundaries established in `firestore.rules`.

### 3. Permissions & Hardware
- Always request and handle permissions asynchronously before attempting to use GPS or camera:
  - `Location.requestForegroundPermissionsAsync()`
  - `ImagePicker.requestCameraPermissionsAsync()` / `requestMediaLibraryPermissionsAsync()`
- Provide user-friendly feedback if permission is denied.

### 4. Robust UX & Error Handling
- Wrap all async operations in `try / catch / finally`.
- Maintain clean loading states (`ActivityIndicator` or disabled buttons during network requests).
- Notify the user with clear alerts (`Alert.alert`) in Spanish upon success or failure.

### 5. Multiplatform Safety
- Keep web compatibility in mind: `react-native-maps` requires fallback handling on Web (`MapScreen.web.js`).

---

## 🧪 Testing with Jest Guidelines
- **Strict Mocking Policy:** Never make real network calls or trigger real hardware sensors during unit tests. Always mock:
  - `firebase/firestore` and `firebase/auth` using `jest.mock()`.
  - `expo-location`, `expo-image-picker`, `expo-secure-store`, `@react-native-async-storage/async-storage`.
  - `@react-navigation/native` (`useNavigation`, `useRoute`).
- **Focus Areas:**
  - Services in `src/services/`: test happy paths, network/permission errors, and data transformation.
  - Business rules: form validations, required fields, and category sanity checks.
- **Hygiene:** Always reset/clear mocks before each test (`beforeEach(() => { jest.clearAllMocks(); })`).

---

## 📦 Technical, Atomic & Separated Commits
- **Conventional Commits Standard:** `<type>(<scope>): <concise technical description>`
  - `feat`: new feature or screen component (e.g., `feat(reports): add category selector with chips`).
  - `fix`: bug fix (e.g., `fix(auth): handle auth/invalid-credential error gracefully`).
  - `test`: adding or updating test suites (e.g., `test(services): add unit tests for reportService with firestore mocks`).
  - `refactor`: internal restructuring without behavior change (e.g., `refactor(services): isolate image upload logic`).
  - `docs`: documentation or rule changes (e.g., `docs(readme): add installation and testing guide`).
  - `chore`: dependency, tool, or build configuration (e.g., `chore(jest): configure jest preset and global mocks`).
- **Strict Atomicity:**
  - One logical change per commit.
  - Never bundle unrelated refactors, UI tweaks, and feature additions in a single commit.
  - Every commit must leave the repository in a stable, buildable state.
- **Commit Messages:** Technical, concise, and written in imperative mood (Spanish or English). Avoid ambiguous messages like "fix", "changes", "wip".
