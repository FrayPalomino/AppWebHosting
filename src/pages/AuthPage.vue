<template>
    <q-page class="flex flex-center auth-bg">
      <!-- Figuras geométricas flotantes de fondo -->
      <div class="floating-shapes">
        <!-- Círculos -->
        <div class="shape circle shape-1"></div>
        <div class="shape circle shape-2"></div>
        <div class="shape circle shape-3"></div>
        
        <!-- Triángulos -->
        <div class="shape triangle shape-4"></div>
        <div class="shape triangle shape-5"></div>
        
        <!-- Rectángulos -->
        <div class="shape rectangle shape-6"></div>
        <div class="shape rectangle shape-7"></div>
        
        <!-- Hexágonos -->
        <div class="shape hexagon shape-8"></div>
        <div class="shape hexagon shape-9"></div>
        
        <!-- Rombos -->
        <div class="shape diamond shape-10"></div>
        <div class="shape diamond shape-11"></div>
      </div>
  
      <div class="auth-container">
        <q-card class="auth-card">
          <q-card-section class="text-center header-section">
            <div class="logo-container">
              <q-icon name="account_circle" size="48px" class="logo-icon" />
            </div>
            <div class="text-h4 text-weight-bold auth-title">
              {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
            </div>
            <div class="auth-subtitle">
              {{ isLogin ? 'Accede a tu cuenta' : 'Crea tu cuenta gratuita' }}
            </div>
          </q-card-section>
  
          <q-card-section class="form-section">
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <div class="input-group">
                <q-input
                  v-model="email"
                  type="email"
                  label="Email"
                  outlined
                  class="custom-input"
                  :rules="[val => !!val || 'Email es requerido']"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="mail" class="input-icon" />
                  </template>
                </q-input>
              </div>
  
              <div class="input-group">
                <q-input
                  v-model="password"
                  type="password"
                  label="Contraseña"
                  outlined
                  class="custom-input"
                  :rules="[val => !!val || 'Contraseña es requerida']"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" class="input-icon" />
                  </template>
                </q-input>
              </div>
  
              <div class="input-group" v-if="!isLogin">
                <q-input
                  v-model="confirmPassword"
                  type="password"
                  label="Confirmar Contraseña"
                  outlined
                  class="custom-input"
                  :rules="[
                    val => !!val || 'Confirmación es requerida',
                    val => val === password || 'Las contraseñas no coinciden'
                  ]"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_outline" class="input-icon" />
                  </template>
                </q-input>
              </div>
  
              <div class="button-group">
                <q-btn
                  type="submit"
                  :label="isLogin ? 'Iniciar Sesión' : 'Registrarse'"
                  color="primary"
                  class="full-width primary-btn"
                  :loading="authStore.loading"
                  :disable="authStore.loading"
                  unelevated
                >
                  <q-icon :name="isLogin ? 'login' : 'person_add'" left />
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
  
          <q-card-section class="text-center toggle-section">
            <div class="toggle-text">
              {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
              <q-btn
                flat
                no-caps
                color="primary"
                :label="isLogin ? 'Regístrate' : 'Inicia Sesión'"
                @click="toggleMode"
                class="toggle-btn"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const isLogin = ref(true)
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  const toggleMode = () => {
    isLogin.value = !isLogin.value
    password.value = ''
    confirmPassword.value = ''
  }
  
  const handleSubmit = async () => {
    try {
      if (isLogin.value) {
        await authStore.signIn(email.value, password.value)
        router.push('/dashboard')
      } else {
        await authStore.signUp(email.value, password.value)
      }
    } catch (error) {
      // Error handling is done in the store
    }
  }
  
  const handleMagicLink = async () => {
    try {
      await authStore.signInWithMagicLink(email.value)
    } catch (error) {
      // Error handling is done in the store
    }
  }
  </script>
  
  <style scoped>
  .auth-bg {
    background: linear-gradient(135deg, #4b5563 0%, #374151 50%, #10b981 100%);
    min-height: 100vh;
    position: relative;
  }
  
  /* Figuras geométricas flotantes */
  .floating-shapes {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }
  
  .shape {
    position: absolute;
    opacity: 0.08;
    animation: float 20s infinite linear;
  }
  
  /* Círculos */
  .circle {
    border-radius: 50%;
  }
  
  .shape-1 {
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #6b7280, #9ca3af);
    top: 10%;
    left: 15%;
    animation-duration: 25s;
  }
  
  .shape-2 {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #10b981, #059669);
    top: 60%;
    right: 20%;
    animation-duration: 30s;
    animation-delay: -5s;
  }
  
  .shape-3 {
    width: 40px;
    height: 40px;
    background: linear-gradient(90deg, #d1d5db, #f3f4f6);
    top: 30%;
    right: 10%;
    animation-duration: 35s;
    animation-delay: -10s;
  }
  
  /* Triángulos */
  .triangle {
    width: 0;
    height: 0;
  }
  
  .shape-4 {
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 45px solid #6b7280;
    top: 20%;
    left: 60%;
    animation-duration: 28s;
    animation-delay: -3s;
  }
  
  .shape-5 {
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 50px solid #10b981;
    top: 70%;
    left: 10%;
    animation-duration: 32s;
    animation-delay: -8s;
  }
  
  /* Rectángulos */
  .rectangle {
    border-radius: 4px;
  }
  
  .shape-6 {
    width: 70px;
    height: 35px;
    background: linear-gradient(45deg, #9ca3af, #d1d5db);
    top: 40%;
    left: 25%;
    animation-duration: 26s;
    animation-delay: -2s;
  }
  
  .shape-7 {
    width: 50px;
    height: 25px;
    background: linear-gradient(135deg, #059669, #047857);
    top: 80%;
    right: 30%;
    animation-duration: 29s;
    animation-delay: -7s;
  }
  
  /* Hexágonos */
  .hexagon {
    width: 50px;
    height: 28px;
    background: #6b7280;
    position: relative;
    margin: 14px 0;
  }
  
  .hexagon:before,
  .hexagon:after {
    content: "";
    position: absolute;
    width: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
  }
  
  .hexagon:before {
    bottom: 100%;
    border-bottom: 14px solid #6b7280;
  }
  
  .hexagon:after {
    top: 100%;
    border-top: 14px solid #6b7280;
  }
  
  .shape-8 {
    top: 15%;
    right: 40%;
    animation-duration: 31s;
    animation-delay: -4s;
  }
  
  .shape-9 {
    background: #10b981;
    top: 50%;
    left: 40%;
    animation-duration: 27s;
    animation-delay: -9s;
  }
  
  .shape-9:before {
    border-bottom-color: #10b981;
  }
  
  .shape-9:after {
    border-top-color: #10b981;
  }
  
  /* Rombos */
  .diamond {
    width: 40px;
    height: 40px;
    background: #9ca3af;
    transform: rotate(45deg);
  }
  
  .shape-10 {
    top: 25%;
    left: 80%;
    animation-duration: 33s;
    animation-delay: -6s;
  }
  
  .shape-11 {
    background: #10b981;
    top: 65%;
    left: 70%;
    animation-duration: 24s;
    animation-delay: -11s;
  }
  
  /* Animaciones de flotación */
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.08;
    }
    50% {
      opacity: 0.15;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  /* Animaciones adicionales para mayor dinamismo */
  .shape-1, .shape-3, .shape-6, .shape-8, .shape-10 {
    animation-name: float-left;
  }
  
  .shape-2, .shape-4, .shape-7, .shape-9, .shape-11 {
    animation-name: float-right;
  }
  
  @keyframes float-left {
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
      opacity: 0.08;
    }
    25% {
      transform: translateY(-25vh) translateX(-20px) rotate(90deg);
      opacity: 0.12;
    }
    50% {
      transform: translateY(-50vh) translateX(10px) rotate(180deg);
      opacity: 0.15;
    }
    75% {
      transform: translateY(-75vh) translateX(-10px) rotate(270deg);
      opacity: 0.10;
    }
    100% {
      transform: translateY(-100vh) translateX(20px) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes float-right {
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
      opacity: 0.08;
    }
    25% {
      transform: translateY(-25vh) translateX(20px) rotate(-90deg);
      opacity: 0.12;
    }
    50% {
      transform: translateY(-50vh) translateX(-10px) rotate(-180deg);
      opacity: 0.15;
    }
    75% {
      transform: translateY(-75vh) translateX(10px) rotate(-270deg);
      opacity: 0.10;
    }
    100% {
      transform: translateY(-100vh) translateX(-20px) rotate(-360deg);
      opacity: 0;
    }
  }
  
  .auth-container {
    width: 100%;
    max-width: 400px;
    padding: 1rem;
    position: relative;
    z-index: 10;
  }
  
  .auth-card {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
  }
  
  .auth-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
  
  /* Header Section */
  .header-section {
    padding: 2rem 1.5rem 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    position: relative;
  }
  
  .header-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #059669, #047857);
  }
  
  .logo-container {
    margin-bottom: 1rem;
  }
  
  .logo-icon {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 50%;
    padding: 8px;
    transition: all 0.3s ease;
  }
  
  .logo-icon:hover {
    transform: scale(1.1);
    background: rgba(16, 185, 129, 0.2);
  }
  
  .auth-title {
    color: #1e293b;
    margin-bottom: 0.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  .auth-subtitle {
    color: #64748b;
    font-size: 0.95rem;
    font-weight: 500;
  }
  
  /* Form Section */
  .form-section {
    padding: 2rem 1.5rem;
  }
  
  .input-group {
    margin-bottom: 0.5rem;
    position: relative;
  }
  
  .custom-input {
    transition: all 0.3s ease;
  }
  
  .custom-input :deep(.q-field__control) {
    border-radius: 12px;
    background: rgba(248, 250, 252, 0.8);
    border: 2px solid #e2e8f0;
    transition: all 0.3s ease;
  }
  
  .custom-input :deep(.q-field__control):hover {
    background: rgba(248, 250, 252, 1);
    border-color: #10b981;
  }
  
  .custom-input :deep(.q-field--focused .q-field__control) {
    background: rgba(248, 250, 252, 1);
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  .custom-input :deep(.q-field__label) {
    color: #64748b;
    font-weight: 500;
  }
  
  .custom-input :deep(.q-field--focused .q-field__label) {
    color: #10b981;
  }
  
  .input-icon {
    color: #94a3b8;
    transition: all 0.3s ease;
  }
  
  .custom-input :deep(.q-field--focused) .input-icon {
    color: #10b981;
  }
  
  /* Button Group */
  .button-group {
    margin-top: 0.5rem;
  }
  
  .primary-btn {
    height: 50px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.5px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .primary-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  .primary-btn:hover::before {
    left: 100%;
  }
  
  .primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
  }
  
  .primary-btn:active {
    transform: translateY(0);
  }
  
  /* Toggle Section */
  .toggle-section {
    padding: 1rem 1.5rem;
    background: rgba(248, 250, 252, 0.5);
  }
  
  .toggle-text {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .toggle-btn {
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .toggle-btn:hover {
    background: rgba(16, 185, 129, 0.1);
    transform: scale(1.05);
  }
  
  /* Custom Separator */
  .custom-separator {
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    height: 2px;
    border: none;
  }
  
  /* Magic Link Section */
  .magic-link-section {
    padding: 1.5rem;
    background: rgba(248, 250, 252, 0.3);
  }
  
  .magic-link-btn {
    height: 45px;
    border-radius: 12px;
    font-weight: 600;
    border: 2px solid #10b981;
    color: #10b981;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .magic-link-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(135deg, #10b981, #059669);
    transition: width 0.3s ease;
    z-index: 1;
  }
  
  .magic-link-btn:hover::before {
    width: 100%;
  }
  
  .magic-link-btn:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }
  
  .magic-link-btn :deep(.q-btn__content) {
    position: relative;
    z-index: 2;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .shape {
      opacity: 0.04;
    }
    
    .shape-1, .shape-2, .shape-3 {
      width: 30px;
      height: 30px;
    }
    
    .shape-4 {
      border-left-width: 15px;
      border-right-width: 15px;
      border-bottom-width: 25px;
    }
    
    .shape-5 {
      border-left-width: 20px;
      border-right-width: 20px;
      border-bottom-width: 35px;
    }
    
    .shape-6, .shape-7 {
      width: 40px;
      height: 20px;
    }
    
    .hexagon {
      width: 30px;
      height: 17px;
    }
    
    .hexagon:before,
    .hexagon:after {
      border-left-width: 15px;
      border-right-width: 15px;
    }
    
    .hexagon:before {
      border-bottom-width: 8px;
    }
    
    .hexagon:after {
      border-top-width: 8px;
    }
    
    .diamond {
      width: 25px;
      height: 25px;
    }
    
    .auth-container {
      padding: 0.5rem;
    }
    
    .header-section {
      padding: 1.5rem 1rem 0.5rem;
    }
    
    .form-section {
      padding: 1.5rem 1rem;
    }
    
    .toggle-section {
      padding: 0.75rem 1rem;
    }
    
    .magic-link-section {
      padding: 1rem;
    }
  }
  
  /* Animaciones de entrada */
  .auth-card {
    animation: slideInUp 0.6s ease-out;
  }
  
  @keyframes slideInUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .input-group {
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: both;
  }
  
  .input-group:nth-child(1) { animation-delay: 0.1s; }
  .input-group:nth-child(2) { animation-delay: 0.2s; }
  .input-group:nth-child(3) { animation-delay: 0.3s; }
  
  @keyframes fadeInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  </style>