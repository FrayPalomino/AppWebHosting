<template>
  <q-page class="dashboard-page">
    <div class="dashboard-container">
      <!-- Header con gradiente -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1 class="dashboard-title">Dashboard</h1>
            <p class="welcome-text">
              Bienvenido de vuelta, <span class="user-email">{{ authStore.user?.email }}</span>
            </p>
          </div>
          <div class="header-decoration">
            <div class="floating-circle circle-1"></div>
            <div class="floating-circle circle-2"></div>
            <div class="floating-circle circle-3"></div>
          </div>
        </div>
      </div>

      <!-- Stats Cards con diseño moderno -->
      <div class="stats-grid">
        <div class="stat-card-modern">
          <div class="stat-icon-wrapper primary-gradient">
            <q-icon name="folder" size="2rem" color="white" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ projects.length }}</div>
            <div class="stat-label">Proyectos Totales</div>
          </div>
          <div class="stat-decoration"></div>
        </div>

        <div class="stat-card-modern">
          <div class="stat-icon-wrapper success-gradient">
            <q-icon name="public" size="2rem" color="white" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ publishedProjects }}</div>
            <div class="stat-label">Sitios Publicados</div>
          </div>
          <div class="stat-decoration"></div>
        </div>

        <div class="stat-card-modern">
          <div class="stat-icon-wrapper info-gradient">
            <q-icon name="insert_drive_file" size="2rem" color="white" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalFiles }}</div>
            <div class="stat-label">Archivos Subidos</div>
          </div>
          <div class="stat-decoration"></div>
        </div>

        <div class="stat-card-modern">
          <div class="stat-icon-wrapper warning-gradient">
            <q-icon name="storage" size="2rem" color="white" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ formatFileSize(totalSize) }}</div>
            <div class="stat-label">Espacio Usado</div>
          </div>
          <div class="stat-decoration"></div>
        </div>
      </div>

      <!-- Action Buttons modernos -->
      <div class="action-section">
        <div class="action-buttons">
          <q-btn
            class="modern-btn primary-btn"
            icon="add"
            label="Nuevo Proyecto"
            no-caps
            @click="$router.push('/projects/new')"
          />
          <q-btn
            class="modern-btn secondary-btn"
            icon="folder_open"
            label="Ver Todos los Proyectos"
            no-caps
            outline
            @click="$router.push('/projects')"
          />
        </div>
      </div>

      <!-- Recent Projects con diseño card moderno -->
      <div class="projects-section">
        <div class="section-header">
          <h2 class="section-title">Proyectos Recientes</h2>
          <div class="section-line"></div>
        </div>

        <div v-if="projectStore.loading" class="loading-state">
          <q-spinner size="3rem" color="primary" />
          <div class="loading-text">Cargando proyectos...</div>
        </div>

        <div v-else-if="recentProjects.length === 0" class="empty-state">
          <div class="empty-icon">
            <q-icon name="folder_open" size="4rem" />
          </div>
          <h3 class="empty-title">No tienes proyectos aún</h3>
          <p class="empty-description">Crea tu primer proyecto para comenzar</p>
          <q-btn
            class="modern-btn primary-btn"
            icon="add"
            label="Crear Proyecto"
            no-caps
            @click="$router.push('/projects/new')"
          />
        </div>

        <div v-else class="projects-grid">
          <div
            v-for="project in recentProjects"
            :key="project.id"
            class="project-card-modern"
            @click="$router.push(`/projects/${project.id}`)"
          >
            <div class="project-header">
              <div class="project-info">
                <h3 class="project-name">{{ project.name }}</h3>
                <div class="project-status">
                  <q-chip
                    :class="project.is_published ? 'status-published' : 'status-draft'"
                    size="sm"
                    square
                  >
                    {{ project.is_published ? 'Publicado' : 'Borrador' }}
                  </q-chip>
                </div>
              </div>
              <div class="project-menu">
                <q-btn
                  flat
                  round
                  icon="more_vert"
                  size="sm"
                  @click.stop
                >
                  <q-menu>
                    <q-list style="min-width: 150px">
                      <q-item 
                        clickable 
                        v-close-popup 
                        @click="editProject(project)"
                      >
                        <q-item-section avatar>
                          <q-icon name="edit" />
                        </q-item-section>
                        <q-item-section>Editar</q-item-section>
                      </q-item>
                      
                      <q-item 
                        v-if="project.is_published"
                        clickable 
                        v-close-popup 
                        @click="togglePublish(project)"
                      >
                        <q-item-section avatar>
                          <q-icon name="visibility_off" />
                        </q-item-section>
                        <q-item-section>Despublicar</q-item-section>
                      </q-item>
                      
                      <q-item 
                        v-else
                        clickable 
                        v-close-popup 
                        @click="togglePublish(project)"
                      >
                        <q-item-section avatar>
                          <q-icon name="public" />
                        </q-item-section>
                        <q-item-section>Publicar</q-item-section>
                      </q-item>
                      
                      <q-item 
                        clickable 
                        v-close-popup 
                        @click="duplicateProject(project)"
                      >
                        <q-item-section avatar>
                          <q-icon name="content_copy" />
                        </q-item-section>
                        <q-item-section>Duplicar</q-item-section>
                      </q-item>
                      
                      <q-separator />
                      
                      <q-item 
                        clickable 
                        v-close-popup 
                        @click="confirmDelete(project)"
                        class="text-negative"
                      >
                        <q-item-section avatar>
                          <q-icon name="delete" />
                        </q-item-section>
                        <q-item-section>Eliminar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>

            <div class="project-description">
              {{ project.description || 'Sin descripción' }}
            </div>

            <div class="project-stats">
              <div class="stat-item">
                <q-icon name="folder" size="1rem" />
                <span>{{ project.file_count || 0 }} archivos</span>
              </div>
              <div class="stat-item">
                <q-icon name="schedule" size="1rem" />
                <span>{{ formatDate(project.updated_at) }}</span>
              </div>
            </div>

            <!-- URL pública si está publicado -->
            <div v-if="project.is_published && project.public_url" class="project-url">
              <div class="url-container">
                <q-input
                  :model-value="project.public_url"
                  readonly
                  dense
                  borderless
                  class="url-input"
                />
                <div class="url-actions">
                  <q-btn
                    flat
                    round
                    icon="content_copy"
                    size="sm"
                    @click.stop="copyToClipboard(project.public_url)"
                  />
                  <q-btn
                    flat
                    round
                    icon="launch"
                    size="sm"
                    @click.stop="openProject(project)"
                  />
                </div>
              </div>
            </div>

            <div class="project-actions">
              <q-btn
                flat
                class="action-btn"
                label="Editar"
                icon="edit"
                no-caps
                @click.stop="editProject(project)"
              />
              <q-btn
                v-if="project.is_published"
                flat
                class="action-btn view-btn"
                label="Ver Sitio"
                icon="launch"
                no-caps
                @click.stop="openProject(project)"
              />
              <q-btn
                flat
                class="action-btn delete-btn"
                label="Eliminar"
                icon="delete"
                no-caps
                @click.stop="confirmDelete(project)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../stores/projects'
import { copyToClipboard as qCopyToClipboard, Notify, Dialog } from 'quasar'

const authStore = useAuthStore()
const projectStore = useProjectStore()

const projects = computed(() => projectStore.projects)

const recentProjects = computed(() => 
  projects.value
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6)
)

const publishedProjects = computed(() => 
  projects.value.filter(p => p.is_published).length
)

const totalFiles = computed(() => 
  projects.value.reduce((sum, p) => sum + (p.file_count || 0), 0)
)

const totalSize = computed(() => 
  projects.value.reduce((sum, p) => sum + (p.total_size || 0), 0)
)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
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

const openProject = (project) => {
  if (project.public_url) {
    window.open(project.public_url, '_blank')
  }
}

const copyToClipboard = async (text) => {
  try {
    await qCopyToClipboard(text)
    Notify.create({
      type: 'positive',
      message: 'URL copiada al portapapeles',
      position: 'top'
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al copiar URL',
      position: 'top'
    })
  }
}

const editProject = (project) => {
  // Navegar a la página de edición
  // Usamos router.push desde el contexto del template
  window.location.href = `/projects/${project.id}`
}

const confirmDelete = (project) => {
  Dialog.create({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que quieres eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`,
    cancel: {
      label: 'Cancelar',
      color: 'grey',
      flat: true
    },
    ok: {
      label: 'Eliminar',
      color: 'negative',
      flat: true
    },
    persistent: true
  }).onOk(() => {
    deleteProject(project)
  })
}

const deleteProject = async (project) => {
  try {
    await projectStore.deleteProject(project.id)
    Notify.create({
      type: 'positive',
      message: `Proyecto "${project.name}" eliminado correctamente`,
      position: 'top'
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al eliminar el proyecto',
      position: 'top'
    })
  }
}

const togglePublish = async (project) => {
  try {
    await projectStore.togglePublish(project.id)
    const action = project.is_published ? 'despublicado' : 'publicado'
    Notify.create({
      type: 'positive',
      message: `Proyecto ${action} correctamente`,
      position: 'top'
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cambiar el estado de publicación',
      position: 'top'
    })
  }
}

const duplicateProject = async (project) => {
  try {
    await projectStore.duplicateProject(project.id)
    Notify.create({
      type: 'positive',
      message: `Proyecto "${project.name}" duplicado correctamente`,
      position: 'top'
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al duplicar el proyecto',
      position: 'top'
    })
  }
}

onMounted(async () => {
  await projectStore.fetchProjects()
})
</script>

<style scoped>
.dashboard-page {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  color: #e2e8f0;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.dashboard-header {
  position: relative;
  background: linear-gradient(135deg, #2a7242 0%, #1F7D53 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 2;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-text {
  font-size: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.user-email {
  font-weight: 600;
  color: white;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  top: -40px;
  right: 100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 120px;
  height: 120px;
  top: 50px;
  right: -60px;
  animation-delay: 2s;
}

.circle-3 {
  width: 60px;
  height: 60px;
  bottom: -30px;
  right: 200px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card-modern {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stat-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.success-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.info-gradient {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.warning-gradient {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  border-radius: 0 16px 0 100px;
}

/* Action Section */
.action-section {
  text-align: center;
  margin-bottom: 3rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.modern-btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 180px;
}

.primary-btn {
  background: linear-gradient(135deg, #10b981 0%, #2a7242 100%);
  color: white;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(179, 180, 186, 0.4);
}

.secondary-btn {
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}

.secondary-btn:hover {
  border-color: #2a7242;
  color: #10b981;
  transform: translateY(-2px);
}

/* Projects Section */
.projects-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.section-header {
  margin-bottom: 2rem;
  position: relative;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
}

.section-line {
  height: 3px;
  width: 60px;
  background: linear-gradient(135deg, #1F7D53 0%, #6d6b6f 100%);
  border-radius: 2px;
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
}

.loading-text {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-icon {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.3);
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.project-card-modern {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.project-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
}

.project-status {
  display: flex;
  align-items: center;
}

.status-published {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.status-draft {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.project-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.project-url {
  margin-bottom: 1rem;
}

.url-container {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.5rem;
}

.url-input {
  flex: 1;
  color: rgba(255, 255, 255, 0.8);
}

.url-actions {
  display: flex;
  gap: 0.5rem;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.action-btn:hover {
  color: #b9b310;
}

.view-btn:hover {
  color: #10b981;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-header {
    padding: 2rem 1.5rem;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>