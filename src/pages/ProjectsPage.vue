<template>
  <q-page class="projects-page">
    <!-- Hero Section con gradiente -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Mis Proyectos</h1>
          <p class="hero-subtitle">Gestiona y organiza todos tus proyectos creativos</p>
        </div>
        <q-btn
          size="md"
          color="white"
          text-color="primary"
          icon="add"
          label="Nuevo Proyecto"
          class="hero-btn"
          @click="$router.push('/projects/new')"
        />
      </div>
    </div>

    <div class="main-content">
      <!-- Search and Filters Card -->
      <q-card class="filters-card" flat>
        <q-card-section class="q-pa-lg">
          <div class="filters-grid">
            <div class="search-container">
              <q-input
                v-model="searchQuery"
                outlined
                placeholder="Buscar proyectos..."
                clearable
                class="search-input"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="primary" />
                </template>
              </q-input>
            </div>
            
            <div class="filter-container">
              <q-select
                v-model="statusFilter"
                outlined
                label="Estado"
                :options="statusOptions"
                clearable
                class="filter-select"
              >
                <template v-slot:prepend>
                  <q-icon name="filter_alt" color="primary" />
                </template>
              </q-select>
            </div>
            
            <div class="sort-container">
              <q-select
                v-model="sortBy"
                outlined
                label="Ordenar por"
                :options="sortOptions"
                class="sort-select"
              >
                <template v-slot:prepend>
                  <q-icon name="sort" color="primary" />
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Loading State -->
      <div v-if="projectStore.loading" class="loading-container">
        <q-spinner-dots size="4rem" color="primary" />
        <div class="loading-text">Cargando proyectos...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-icon">
          <q-icon name="folder_open" size="5rem" color="grey-4" />
        </div>
        <h3 class="empty-title">
          {{ searchQuery ? 'No se encontraron proyectos' : 'No tienes proyectos aún' }}
        </h3>
        <p class="empty-subtitle">
          {{ searchQuery ? 'Intenta con otros términos de búsqueda' : 'Crea tu primer proyecto para comenzar tu viaje creativo' }}
        </p>
        <q-btn
          v-if="!searchQuery"
          color="primary"
          icon="add"
          label="Crear Primer Proyecto"
          size="lg"
          class="empty-btn"
          @click="$router.push('/projects/new')"
        />
      </div>

      <!-- Projects Grid -->
      <div v-else class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card-wrapper"
        >
          <q-card class="project-card" flat>
            <!-- Project Header -->
            <div class="project-header" @click="$router.push(`/projects/${project.id}`)">
              <div class="project-info">
                <h4 class="project-name">{{ project.name }}</h4>
                <q-chip
                  :color="project.is_published ? 'positive' : 'warning'"
                  text-color="white"
                  size="sm"
                  class="status-chip"
                >
                  <q-icon 
                    :name="project.is_published ? 'check_circle' : 'schedule'" 
                    size="14px" 
                    class="q-mr-xs"
                  />
                  {{ project.is_published ? 'Publicado' : 'Borrador' }}
                </q-chip>
              </div>
            </div>

            <!-- Project Content -->
            <q-card-section class="project-content" @click="$router.push(`/projects/${project.id}`)">
              <p class="project-description">
                {{ project.description || 'Sin descripción disponible' }}
              </p>

              <!-- Project Stats -->
              <div class="project-stats">
                <div class="stat-item">
                  <q-icon name="folder" color="primary" size="16px" />
                  <span>{{ project.file_count || 0 }} archivos</span>
                </div>
                <div class="stat-item">
                  <q-icon name="storage" color="secondary" size="16px" />
                  <span>{{ formatFileSize(project.total_size || 0) }}</span>
                </div>
              </div>

              <!-- Last Updated -->
              <div class="last-updated">
                <q-icon name="schedule" color="grey-5" size="14px" />
                <span>Actualizado {{ formatDate(project.updated_at) }}</span>
              </div>
            </q-card-section>

            <!-- Project Actions -->
            <q-card-actions class="project-actions">
              <q-btn
                flat
                color="primary"
                icon="edit"
                label="Editar"
                class="action-btn"
                @click.stop="$router.push(`/projects/${project.id}`)"
              />
              <q-btn
                v-if="project.is_published"
                flat
                color="positive"
                icon="launch"
                label="Ver Sitio"
                class="action-btn"
                @click.stop="openProject(project)"
              />
              <q-space />
              <q-btn
                flat
                color="negative"
                icon="delete"
                round
                size="sm"
                class="delete-btn"
                @click.stop="confirmDelete(project)"
              >
                <q-tooltip>Eliminar proyecto</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card class="delete-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon">
            <q-icon name="warning" color="negative" size="2rem" />
          </div>
          <h4 class="dialog-title">Confirmar eliminación</h4>
        </q-card-section>

        <q-card-section class="dialog-content">
          <p>¿Estás seguro de que quieres eliminar el proyecto <strong>"{{ projectToDelete?.name }}"</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="primary" 
            v-close-popup 
            class="cancel-btn"
          />
          <q-btn
            flat
            label="Eliminar"
            color="negative"
            @click="deleteProject"
            :loading="projectStore.loading"
            class="delete-confirm-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '../stores/projects'

const projectStore = useProjectStore()

const searchQuery = ref('')
const statusFilter = ref(null)
const sortBy = ref('updated_at')
const deleteDialog = ref(false)
const projectToDelete = ref(null)

const statusOptions = [
  { label: 'Publicado', value: 'published' },
  { label: 'Borrador', value: 'draft' }
]

const sortOptions = [
  { label: 'Más reciente', value: 'updated_at' },
  { label: 'Más antiguo', value: 'created_at' },
  { label: 'Nombre A-Z', value: 'name_asc' },
  { label: 'Nombre Z-A', value: 'name_desc' }
]

const filteredProjects = computed(() => {
  let filtered = [...projectStore.projects]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query))
    )
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(project => {
      if (statusFilter.value.value === 'published') return project.is_published
      if (statusFilter.value.value === 'draft') return !project.is_published
      return true
    })
  }

  // Sort
  if (sortBy.value) {
    filtered.sort((a, b) => {
      switch (sortBy.value.value || sortBy.value) {
        case 'updated_at':
          return new Date(b.updated_at) - new Date(a.updated_at)
        case 'created_at':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        default:
          return new Date(b.updated_at) - new Date(a.updated_at)
      }
    })
  }

  return filtered
})

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

const confirmDelete = (project) => {
  projectToDelete.value = project
  deleteDialog.value = true
}

const deleteProject = async () => {
  if (projectToDelete.value) {
    await projectStore.deleteProject(projectToDelete.value.id)
    deleteDialog.value = false
    projectToDelete.value = null
  }
}

onMounted(async () => {
  await projectStore.fetchProjects()
})
</script>

<style scoped>
.projects-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1F7D53 0%, #255F38 100%);
}

.hero-section {
  background: linear-gradient(135deg, #1F7D53 0%, #255F38 100%);
  padding: 4rem 2rem 2rem;
  margin-bottom: 2rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.hero-text {
  flex: 1;
  min-width: 300px;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
}

.hero-btn {
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.filters-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1.5rem;
  align-items: end;
}

.search-input,
.filter-select,
.sort-select {
  border-radius: 12px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.empty-icon {
  margin-bottom: 2rem;
}

.empty-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
}

.empty-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 2rem 0;
  max-width: 400px;
  line-height: 1.6;
}

.empty-btn {
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-weight: 600;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card-wrapper {
  display: flex;
}

.project-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.project-header {
  padding: 1.5rem 1.5rem 0;
  cursor: pointer;
}

.project-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.project-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.status-chip {
  border-radius: 20px;
  font-weight: 500;
  white-space: nowrap;
}

.project-content {
  padding: 1rem 1.5rem;
  flex: 1;
  cursor: pointer;
}

.project-description {
  color: #666;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 4.8rem;
}

.project-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  font-size: 0.8rem;
}

.project-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
  background: rgba(0, 0, 0, 0.02);
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
}

.delete-btn {
  border-radius: 50%;
  background: rgba(244, 67, 54, 0.1);
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.2);
}

/* Delete Dialog */
.delete-dialog {
  border-radius: 16px;
  max-width: 400px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.dialog-icon {
  margin-bottom: 1rem;
}

.dialog-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.dialog-content {
  padding: 1rem 2rem;
  text-align: center;
}

.dialog-content p {
  margin: 0 0 1rem 0;
  color: #666;
  line-height: 1.6;
}

.warning-text {
  color: #f44336;
  font-weight: 500;
}

.dialog-actions {
  padding: 1rem 2rem 2rem;
  justify-content: center;
  gap: 1rem;
}

.cancel-btn,
.delete-confirm-btn {
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem 1rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .project-card {
    margin: 0;
  }

  .project-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .project-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .project-actions {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .main-content {
    padding: 0 0.5rem 1rem;
  }

  .filters-card,
  .project-card,
  .loading-container,
  .empty-state {
    border-radius: 12px;
  }

  .project-header,
  .project-content {
    padding: 1rem;
  }

  .project-actions {
    padding: 0.75rem 1rem;
  }
}
</style>
  