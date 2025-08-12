// ===============================
// Archivo de configuración de Firebase
// Descripción: Permite conectar la app SafeBuzz con el proyecto Firebase en la nube.
// Documentado para principiantes.
// ===============================

import firebase from "firebase/compat/app"; // Importa el SDK web tradicional de Firebase
import "firebase/compat/auth"; // Importa el módulo de autenticación
import "firebase/compat/firestore"; // Importa el módulo de base de datos Firestore

// ===============================
// Configuración de tu proyecto Firebase
// Copia estos datos desde la consola de Firebase > Configuración del proyecto
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyBxy6S1rcH6N8LgF-5IH1EJ5k-AK3zVIdk",
  authDomain: "safebuzz-sincronizado.firebaseapp.com",
  projectId: "safebuzz-sincronizado",
  storageBucket: "safebuzz-sincronizado.firebasestorage.app",
  messagingSenderId: "553775691461",
  appId: "1:553775691461:web:b69267daba8f2cfab462ac",
  measurementId: "G-13N9P51HKM"
};

// ===============================
// Inicializa Firebase solo una vez
// Esto previene errores si el archivo se importa varias veces
// ===============================
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ===============================
// Exporta la instancia de autenticación y base de datos
// Así puedes usar 'auth' y 'db' en cualquier archivo de la app
// ===============================
export const auth = firebase.auth();
export const db = firebase.firestore();

// ===============================
// Funciones auxiliares para autenticación
// ===============================

// Función para verificar si un email ya está registrado
export const checkEmailExists = async (email) => {
  try {
    const signInMethods = await auth.fetchSignInMethodsForEmail(email);
    return {
      exists: signInMethods.length > 0,
      methods: signInMethods
    };
  } catch (error) {
    console.error("Error checking email:", error);
    return {
      exists: false,
      methods: [],
      error: error.message
    };
  }
};

// Función para obtener mensajes de error amigables
const getFirebaseErrorMessage = (errorCode, errorMessage) => {
  console.log("Firebase Error Code:", errorCode); // Para debugging
  console.log("Firebase Error Message:", errorMessage); // Para debugging
  
  const errorMessages = {
    'auth/email-already-in-use': 'Este correo ya está registrado. ¿Ya tienes una cuenta? Intenta iniciar sesión.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email': 'El formato del correo electrónico no es válido.',
    'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta nuevamente más tarde.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/operation-not-allowed': 'Esta operación no está permitida.',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
    'auth/missing-password': 'Por favor ingresa una contraseña.',
    'auth/missing-email': 'Por favor ingresa un correo electrónico.',
    'auth/invalid-credential': 'Las credenciales proporcionadas son incorrectas.',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este correo usando un método diferente.',
    'auth/requires-recent-login': 'Por seguridad, necesitas iniciar sesión nuevamente.',
    'auth/credential-already-in-use': 'Estas credenciales ya están en uso por otra cuenta.',
    'auth/timeout': 'La operación ha tardado demasiado. Intenta nuevamente.',
  };
  
  // Si conocemos el error, devolvemos el mensaje personalizado
  if (errorMessages[errorCode]) {
    return errorMessages[errorCode];
  }
  
  // Si no conocemos el error, devolvemos el mensaje original de Firebase para debugging
  return `Error: ${errorMessage || errorCode || 'Error desconocido'}`;
};

// Función especial para manejar errores de permisos
const handlePermissionError = (error) => {
  if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
    return {
      success: false,
      error: 'Error de permisos: Las reglas de seguridad de Firebase necesitan ser configuradas. Contacta al administrador.',
      errorCode: 'permission-denied',
      suggestion: 'Configura las reglas de Firestore para permitir lectura/escritura a usuarios autenticados.'
    };
  }
  return null;
};

// Función para registrar un nuevo usuario
export const createUserWithEmailAndPassword = async (email, password, userData = {}) => {
  try {
    console.log("Intentando crear usuario con email:", email); // Para debugging
    
    // Validaciones básicas
    if (!email || !password) {
      return {
        success: false,
        error: "Por favor completa todos los campos.",
        errorCode: "missing-fields"
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres.",
        errorCode: "weak-password"
      };
    }

    // Crear usuario en Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Usuario creado exitosamente:", user.uid); // Para debugging

    // Guardar información adicional del usuario en Firestore
    try {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        uid: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: userData.name || '',
        ...userData
      });
      console.log("Datos guardados en Firestore"); // Para debugging
    } catch (firestoreError) {
      console.warn("Error guardando en Firestore, pero usuario creado en Auth:", firestoreError);
      // El usuario se creó en Auth exitosamente, solo falló Firestore
      // Esto puede ser por reglas de seguridad
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData.name || '',
        ...userData
      }
    };
  } catch (error) {
    console.error("Error completo al crear usuario:", error); // Para debugging
    console.error("Error code:", error.code); // Para debugging
    console.error("Error message:", error.message); // Para debugging
    
    // Manejar errores de permisos específicamente
    const permissionError = handlePermissionError(error);
    if (permissionError) {
      return permissionError;
    }
    
    return {
      success: false,
      error: getFirebaseErrorMessage(error.code, error.message),
      errorCode: error.code,
      originalError: error.message // Para debugging
    };
  }
};

// Función para iniciar sesión
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    console.log("Intentando iniciar sesión con email:", email); // Para debugging
    
    // Validaciones básicas
    if (!email || !password) {
      return {
        success: false,
        error: "Por favor completa todos los campos.",
        errorCode: "missing-fields"
      };
    }

    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Usuario autenticado exitosamente:", user.uid); // Para debugging

    // Obtener datos adicionales del usuario desde Firestore
    let userData = {};
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      userData = userDoc.exists ? userDoc.data() : {};
      console.log("Datos del usuario obtenidos de Firestore"); // Para debugging
    } catch (firestoreError) {
      console.warn("Error obteniendo datos de Firestore, usando solo datos de Auth:", firestoreError);
      // Continuar con datos básicos del usuario de Auth
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || userData.name || '',
        ...userData
      }
    };
  } catch (error) {
    console.error("Error completo al iniciar sesión:", error); // Para debugging
    console.error("Error code:", error.code); // Para debugging
    console.error("Error message:", error.message); // Para debugging
    
    // Manejar errores de permisos específicamente
    const permissionError = handlePermissionError(error);
    if (permissionError) {
      return permissionError;
    }
    
    return {
      success: false,
      error: getFirebaseErrorMessage(error.code, error.message),
      errorCode: error.code,
      originalError: error.message // Para debugging
    };
  }
};

// Función para cerrar sesión
export const signOut = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ===============================
// Funciones de debugging y utilidades
// ===============================

// Función para mostrar las reglas de Firestore que necesitas configurar
export const getFirestoreRulesInstructions = () => {
  const rules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para la colección de usuarios
    match /users/{userId} {
      // Permitir que los usuarios lean y escriban solo sus propios datos
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para colección de prueba (opcional)
    match /test/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Por defecto, denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

  console.log("========================================");
  console.log("CONFIGURACIÓN REQUERIDA PARA FIRESTORE");
  console.log("========================================");
  console.log("1. Ve a la consola de Firebase: https://console.firebase.google.com");
  console.log("2. Selecciona tu proyecto: safebuzz-sincronizado");
  console.log("3. Ve a 'Firestore Database' en el menú lateral");
  console.log("4. Ve a la pestaña 'Rules'");
  console.log("5. Reemplaza las reglas existentes con estas:");
  console.log(rules);
  console.log("6. Haz clic en 'Publish' para guardar");
  console.log("========================================");
  
  return rules;
};

// Función para verificar la conexión con Firebase
export const testFirebaseConnection = async () => {
  try {
    console.log("Probando conexión con Firebase...");
    
    // Intentar obtener el usuario actual
    const currentUser = auth.currentUser;
    console.log("Usuario actual:", currentUser);
    
    // Intentar hacer una consulta simple a Firestore
    const testDoc = await db.collection('test').limit(1).get();
    console.log("Conexión con Firestore exitosa");
    
    return {
      success: true,
      message: "Conexión con Firebase exitosa",
      currentUser: currentUser ? currentUser.email : null
    };
  } catch (error) {
    console.error("Error de conexión con Firebase:", error);
    return {
      success: false,
      error: error.message,
      errorCode: error.code
    };
  }
};

// Listener para cambios en el estado de autenticación
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Usuario autenticado:", user.email);
      // Obtener datos adicionales del usuario
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          const userData = doc.exists ? doc.data() : {};
          callback({
            uid: user.uid,
            email: user.email,
            displayName: userData.displayName || userData.name || '',
            ...userData
          });
        })
        .catch((error) => {
          console.error("Error obteniendo datos del usuario:", error);
          callback({
            uid: user.uid,
            email: user.email,
            displayName: '',
          });
        });
    } else {
      console.log("Usuario no autenticado");
      callback(null);
    }
  });
};

// ===============================
// Fin del archivo firebaseConfig.js
// ===============================
