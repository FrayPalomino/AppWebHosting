<template>
  <div class="auth-container">
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

    <div class="auth-card">
      <div class="auth-header">
        <h1>{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h1>
        <p>{{ isLogin ? 'Accede a tu cuenta' : 'Crea tu cuenta gratuita' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label class="form-label">Confirmar Contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse') }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
          <button
            @click="toggleMode"
            class="auth-toggle"
            type="button"
          >
            {{ isLogin ? 'Regístrate' : 'Inicia Sesión' }}
          </button>
        </p>
      </div>

      <div class="divider">
        <span>o</span>
      </div>

      <button
        @click="handleMagicLink"
        class="btn btn-secondary w-full"
        :disabled="loading"
      >
        Enviar enlace mágico
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const handleSubmit = async () => {
  error.value = ''
  
  if (!isLogin.value && password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true

  try {
    if (isLogin.value) {
      await authStore.signIn(email.value, password.value)
    } else {
      await authStore.signUp(email.value, password.value)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleMagicLink = async () => {
  if (!email.value) {
    error.value = 'Por favor ingresa tu email'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.signInWithMagicLink(email.value)
    error.value = ''
    // Mostrar mensaje de éxito
    alert('¡Revisa tu email para el enlace de acceso!')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4b5563 0%, #374151 50%, #10b981 100%);
  padding: 1rem;
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

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #6b7280;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.w-full {
  width: 100%;
}

.auth-footer {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-toggle {
  background: none;
  border: none;
  color: #10b981;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
}

.auth-toggle:hover {
  color: #059669;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
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
}
</style>
  