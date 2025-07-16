<template>
  <q-page class="profile-page">
    <div class="page-container">
      <div class="profile-header">
        <div class="header-content">
          <div class="profile-avatar">
            <q-avatar size="80px" class="avatar-gradient">
              <q-icon name="person" size="40px" color="white" />
            </q-avatar>
          </div>
          <div class="header-info">
            <h1 class="profile-title">Mi Perfil</h1>
            <p class="profile-subtitle">Gestiona tu información personal y preferencias</p>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Profile Information Card -->
        <div class="card-container">
          <q-card class="modern-card profile-card">
            <q-card-section class="card-header">
              <div class="section-title">
                <q-icon name="person_outline" class="title-icon" />
                <span>Información Personal</span>
              </div>
            </q-card-section>

            <q-card-section class="card-content">
              <q-form @submit="updateProfile" class="profile-form">
                <div class="form-group">
                  <q-input
                    v-model="form.email"
                    label="Email"
                    outlined
                    readonly
                    class="modern-input"
                    bg-color="grey-9"
                    label-color="grey-4"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" color="grey-5" />
                    </template>
                    <template v-slot:hint>
                      <span class="input-hint">El email no se puede cambiar</span>
                    </template>
                  </q-input>
                </div>

                <div class="form-group">
                  <q-input
                    v-model="form.full_name"
                    label="Nombre Completo"
                    outlined
                    class="modern-input"
                    bg-color="grey-9"
                    label-color="grey-4"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" color="grey-5" />
                    </template>
                  </q-input>
                </div>

                <div class="form-group">
                  <q-input
                    v-model="form.website"
                    label="Sitio Web"
                    outlined
                    placeholder="https://tu-sitio.com"
                    class="modern-input"
                    bg-color="grey-9"
                    label-color="grey-4"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <q-icon name="language" color="grey-5" />
                    </template>
                  </q-input>
                </div>

                <div class="form-group">
                  <q-input
                    v-model="form.bio"
                    label="Biografía"
                    outlined
                    type="textarea"
                    rows="3"
                    placeholder="Cuéntanos sobre ti..."
                    class="modern-input"
                    bg-color="grey-9"
                    label-color="grey-4"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <q-icon name="description" color="grey-5" />
                    </template>
                  </q-input>
                </div>

                <q-separator class="modern-separator" />

                <div class="section-title password-section">
                  <q-icon name="lock_outline" class="title-icon" />
                  <span>Cambiar Contraseña</span>
                </div>
                
                <div class="form-group">
                  <q-input
                    v-model="passwordForm.currentPassword"
                    label="Contraseña Actual"
                    outlined
                    type="password"
                    class="modern-input"
                    bg-color="grey-9"
                    label-color="grey-4"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" color="grey-5" />
                    </template>
                  </q-input>
                </div>

                <div class="form-group">
                  <q-input
                    v-model="passwordForm.newPassword"
                    label="Nueva Contraseña"
                    outlined
                    type="password"
                    class="modern-input"
                    bg-color="grey-9"
                    label-color="grey-4"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_reset" color="grey-5" />
                    </template>
                  </q-input>
                </div>

                <div class="form-group">
                  <q-input
                    v-model="passwordForm.confirmPassword"
                    label="Confirmar Nueva Contraseña"
                    outlined
                    type="password"
                    class="modern-input"
                    bg-color="grey-9"
                    label-color="grey-4"
                    color="primary"
                  >
                    <template v-slot:prepend>
                      <q-icon name="verified" color="grey-5" />
                    </template>
                  </q-input>
                </div>

                <q-card-actions class="form-actions">
                  <q-btn
                    flat
                    label="Cancelar"
                    color="grey-5"
                    class="cancel-btn"
                    @click="resetForm"
                  />
                  <q-btn
                    type="submit"
                    label="Guardar Cambios"
                    color="primary"
                    class="save-btn"
                    :loading="authStore.loading"
                    unelevated
                  >
                    <q-icon name="save" left />
                  </q-btn>
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- Statistics Card -->
        <div class="card-container">
          <q-card class="modern-card stats-card">
            <q-card-section class="card-header">
              <div class="section-title">
                <q-icon name="analytics" class="title-icon" />
                <span>Estadísticas</span>
              </div>
            </q-card-section>

            <q-card-section class="card-content">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-icon projects">
                    <q-icon name="folder" />
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ projectStats.total }}</div>
                    <div class="stat-label">Proyectos Totales</div>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon published">
                    <q-icon name="public" />
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ projectStats.published }}</div>
                    <div class="stat-label">Sitios Publicados</div>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon storage">
                    <q-icon name="storage" />
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ formatFileSize(projectStats.totalSize) }}</div>
                    <div class="stat-label">Espacio Usado</div>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon member">
                    <q-icon name="calendar_today" />
                  </div>
                  <div class="stat-content">
                    <div class="stat-number">{{ formatDate(authStore.user?.created_at) }}</div>
                    <div class="stat-label">Miembro desde</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Danger Zone Card -->
        <div class="card-container full-width">
          <q-card class="modern-card danger-card">
            <q-card-section class="card-header">
              <div class="section-title danger-title">
                <q-icon name="warning" class="title-icon" />
                <span>Zona de Peligro</span>
              </div>
            </q-card-section>

            <q-card-section class="card-content">
              <div class="danger-content">
                <div class="danger-info">
                  <div class="danger-label">Eliminar Cuenta</div>
                  <div class="danger-description">
                    Esta acción eliminará permanentemente tu cuenta y todos tus proyectos
                  </div>
                </div>
                <q-btn
                  color="negative"
                  outline
                  label="Eliminar Cuenta"
                  class="danger-btn"
                  @click="confirmDeleteAccount"
                >
                  <q-icon name="delete_forever" left />
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Delete Account Dialog -->
    <q-dialog v-model="deleteAccountDialog" class="delete-dialog">
      <q-card class="modern-card dialog-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title">
            <q-icon name="warning" color="negative" class="dialog-icon" />
            <span>Confirmar Eliminación de Cuenta</span>
          </div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <p class="warning-text">Esta acción es <strong>irreversible</strong>. Se eliminarán:</p>
          <div class="deletion-list">
            <div class="deletion-item">
              <q-icon name="person" color="negative" />
              <span>Tu cuenta de usuario</span>
            </div>
            <div class="deletion-item">
              <q-icon name="folder" color="negative" />
              <span>Todos tus proyectos ({{ projectStats.total }})</span>
            </div>
            <div class="deletion-item">
              <q-icon name="attach_file" color="negative" />
              <span>Todos los archivos subidos</span>
            </div>
            <div class="deletion-item">
              <q-icon name="public" color="negative" />
              <span>Todos los sitios publicados</span>
            </div>
          </div>
          
          <q-input
            v-model="deleteConfirmation"
            label="Escribe 'ELIMINAR' para confirmar"
            outlined
            class="modern-input confirmation-input"
            bg-color="grey-9"
            label-color="grey-4"
            color="negative"
          />
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
          <q-btn
            flat
            label="Eliminar Cuenta"
            color="negative"
            :disable="deleteConfirmation !== 'ELIMINAR'"
            @click="deleteAccount"
          >
            <q-icon name="delete_forever" left />
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/projects'
import { Notify } from 'quasar'

const authStore = useAuthStore()
const projectStore = useProjectStore()

const deleteAccountDialog = ref(false)
const deleteConfirmation = ref('')

const form = ref({
  email: '',
  full_name: '',
  website: '',
  bio: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const projectStats = computed(() => {
  const projects = projectStore.projects
  return {
    total: projects.length,
    published: projects.filter(p => p.is_published).length,
    totalSize: projects.reduce((sum, p) => sum + (p.total_size || 0), 0)
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const resetForm = () => {
  form.value = {
    email: authStore.user?.email || '',
    full_name: '',
    website: '',
    bio: ''
  }
  
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const updateProfile = async () => {
  try {
    // Validate password change if provided
    if (passwordForm.value.newPassword) {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        Notify.create({
          type: 'negative',
          message: 'Las contraseñas no coinciden',
          position: 'top'
        })
        return
      }

      if (!passwordForm.value.currentPassword) {
        Notify.create({
          type: 'negative',
          message: 'Debes proporcionar tu contraseña actual',
          position: 'top'
        })
        return
      }
    }

    // Update profile
    const updates = {}
    
    if (form.value.full_name) updates.full_name = form.value.full_name
    if (form.value.website) updates.website = form.value.website
    if (form.value.bio) updates.bio = form.value.bio
    
    if (passwordForm.value.newPassword) {
      updates.password = passwordForm.value.newPassword
    }

    await authStore.updateProfile(updates)
    
    // Clear password fields
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

const confirmDeleteAccount = () => {
  deleteAccountDialog.value = true
  deleteConfirmation.value = ''
}

const deleteAccount = () => {
  // Account deletion logic would be implemented here
  Notify.create({
    type: 'info',
    message: 'Funcionalidad de eliminación de cuenta en desarrollo',
    position: 'top'
  })
  deleteAccountDialog.value = false
}

onMounted(async () => {
  // Load user profile data
  resetForm()
  
  // Load projects for statistics
  await projectStore.fetchProjects()
})
</script>

<style scoped>
.profile-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: #ffffff;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-gradient {
  background: linear-gradient(135deg, #1F7D53 0%, #2a7242 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.profile-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #b4b8b6 0%, #dfe9e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-subtitle {
  color: #b0b3b8;
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.card-container {
  min-height: fit-content;
}

.full-width {
  grid-column: 1 / -1;
}

.modern-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.card-header {
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.title-icon {
  font-size: 1.5rem;
  color: #1F7D53;
}

.card-content {
  padding: 1.5rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.modern-input {
  border-radius: 12px;
}

.modern-input :deep(.q-field__control) {
  border-radius: 12px;
}

.modern-input :deep(.q-field__native) {
  color: #ffffff;
}

.input-hint {
  color: #8a8a8a;
  font-size: 0.85rem;
}

.modern-separator {
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.1);
}

.password-section {
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
}

.save-btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #1F7D53 0%, #2a7242 100%);
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.projects {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.published {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-icon.storage {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.member {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #b0b3b8;
  font-size: 0.9rem;
}

.danger-card {
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.danger-title {
  color: #f44336;
}

.danger-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.danger-info {
  flex: 1;
}

.danger-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f44336;
  margin-bottom: 0.5rem;
}

.danger-description {
  color: #b0b3b8;
  font-size: 0.95rem;
}

.danger-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #f44336;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: rgba(244, 67, 54, 0.1);
}

.dialog-card {
  min-width: 500px;
}

.dialog-header {
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
}

.dialog-icon {
  font-size: 1.5rem;
}

.dialog-content {
  padding: 2rem;
}

.warning-text {
  color: #ffffff;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.deletion-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.deletion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #b0b3b8;
  font-size: 0.95rem;
}

.confirmation-input {
  margin-top: 1rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-title {
    font-size: 2rem;
  }
  
  .danger-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .dialog-card {
    min-width: 90vw;
  }
}
</style>