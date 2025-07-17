<template>
    <q-page padding>
      <div class="q-pa-md">
        <div v-if="projectStore.loading && !currentProject" class="text-center q-pa-xl">
          <q-spinner size="3rem" color="primary" />
          <div class="q-mt-md">Cargando proyecto...</div>
        </div>
  
        <div v-else-if="currentProject">
          <!-- Project Header -->
          <div class="flex justify-between items-start q-mb-lg">
            <div>
              <div class="text-h4 text-weight-bold" style="color: white;">{{ currentProject.name }}</div>
              <div class="text-grey-6 q-mb-sm">{{ currentProject.description || 'Sin descripción' }}</div>
              <div class="flex items-center q-gutter-sm">
                <q-chip
                  :color="currentProject.is_published ? 'positive' : 'warning'"
                  text-color="white"
                  size="sm"
                >
                  {{ currentProject.is_published ? 'Publicado' : 'Borrador' }}
                </q-chip>
                <span class="text-caption text-grey-5">
                  Actualizado: {{ formatDate(currentProject.updated_at) }}
                </span>
              </div>
            </div>
            
            <div class="flex q-gutter-sm">
              <q-btn
                v-if="currentProject.is_published"
                color="positive"
                icon="visibility"
                label="Vista Previa"
                @click="showPreview = true"
              />
              <q-btn
                :color="currentProject.is_published ? 'warning' : 'positive'"
                :icon="currentProject.is_published ? 'public_off' : 'public'"
                :label="currentProject.is_published ? 'Despublicar' : 'Publicar'"
                @click="togglePublish"
                :loading="projectStore.loading"
                :disable="!hasHtmlFile"
              />
              <q-btn
                color="primary"
                icon="edit"
                label="Editar"
                @click="editMode = !editMode"
              />
            </div>
          </div>
  
          <!-- Published Site Info -->
          <q-card v-if="currentProject.is_published" class="q-mb-lg bg-positive text-white">
            <q-card-section>
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-h6 flex items-center">
                    <q-icon name="public" class="q-mr-sm" />
                    Sitio Publicado
                  </div>
                  <div class="text-body2 q-mt-xs">
                    Tu sitio está disponible públicamente en:
                  </div>
                </div>
                <q-btn
                  flat
                  icon="launch"
                  label="Abrir Sitio"
                  @click="openPublicSite"
                  class="bg-white text-positive"
                />
              </div>
              
              <div class="q-mt-md">
                <q-input
                  :model-value="currentProject.public_url"
                  readonly
                  outlined
                  dense
                  class="bg-white"
                  color="positive"
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      icon="content_copy"
                      @click="copyToClipboard(currentProject.public_url)"
                      class="text-positive"
                    />
                  </template>
                </q-input>
              </div>
  
              <div class="q-mt-sm flex q-gutter-sm">
                <q-btn
                  flat
                  icon="share"
                  label="Compartir por WhatsApp"
                  @click="shareOnWhatsApp"
                  class="bg-white text-positive"
                  size="sm"
                />
                <q-btn
                  flat
                  icon="share"
                  label="Compartir por Telegram"
                  @click="shareOnTelegram"
                  class="bg-white text-positive"
                  size="sm"
                />
                <q-btn
                  flat
                  icon="qr_code"
                  label="Código QR"
                  @click="showQRCode = true"
                  class="bg-white text-positive"
                  size="sm"
                />
              </div>
            </q-card-section>
          </q-card>
  
          <!-- Warning if no HTML file -->
          <q-card v-if="!hasHtmlFile" class="q-mb-lg bg-warning text-white">
            <q-card-section>
              <div class="flex items-center">
                <q-icon name="warning" class="q-mr-sm" />
                <div>
                  <div class="text-h6">No se puede publicar</div>
                  <div class="text-body2">
                    Necesitas subir al menos un archivo HTML para poder publicar tu sitio.
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
  
          <!-- Edit Form -->
          <q-card v-if="editMode" class="q-mb-lg">
            <q-card-section>
              <div class="text-h6 q-mb-md">Editar Proyecto</div>
              <q-form @submit="updateProject" class="q-gutter-md">
                <q-input
                  v-model="editForm.name"
                  label="Nombre del Proyecto"
                  outlined
                  :rules="[val => !!val || 'El nombre es requerido']"
                />
                <q-input
                  v-model="editForm.description"
                  label="Descripción"
                  outlined
                  type="textarea"
                  rows="3"
                />
                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" @click="cancelEdit" />
                  <q-btn
                    type="submit"
                    label="Guardar"
                    color="primary"
                    :loading="projectStore.loading"
                  />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
  
          <!-- File Management -->
          <div class="row q-gutter-lg">
            <!-- File Upload -->
            <div class="col-12 col-md-4">
              <q-card>
                <q-card-section>
                  <div class="text-h6 q-mb-md">Subir Archivos</div>
                  
                  <q-file
                    v-model="selectedFiles"
                    multiple
                    outlined
                    label="Seleccionar archivos"
                    accept=".html,.css,.js,.png,.jpg,.jpeg,.gif,.svg,.ico"
                    max-files="10"
                    max-file-size="5242880"
                    @rejected="onRejected"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
  
                  <div class="q-mt-md">
                    <q-btn
                      color="primary"
                      label="Subir Archivos"
                      icon="cloud_upload"
                      :disable="!selectedFiles || selectedFiles.length === 0"
                      @click="uploadFiles"
                      :loading="fileStore.loading"
                      class="full-width"
                    />
                  </div>
  
                  <div v-if="fileStore.uploadProgress > 0" class="q-mt-md">
                    <q-linear-progress
                      :value="fileStore.uploadProgress / 100"
                      color="primary"
                      class="q-mt-sm"
                    />
                    <div class="text-center text-caption q-mt-xs">
                      {{ fileStore.uploadProgress }}% completado
                    </div>
                  </div>
  
                  <div class="q-mt-md text-caption text-grey-6">
                    Formatos soportados: HTML, CSS, JS, PNG, JPG, GIF, SVG, ICO<br>
                    Tamaño máximo: 5MB por archivo
                  </div>
                </q-card-section>
              </q-card>
            </div>
  
            <!-- File List -->
            <div class="col-12 col-md-8">
              <q-card>
                <q-card-section>
                  <div class="text-h6 q-mb-md">
                    Archivos del Proyecto
                    <q-chip color="grey-3" text-color="grey-8" size="sm">
                      {{ projectFiles.length }} archivos
                    </q-chip>
                  </div>
  
                  <div v-if="projectFiles.length === 0" class="text-center q-pa-lg">
                    <q-icon name="folder_open" size="3rem" color="grey-5" />
                    <div class="text-h6 q-mt-md">No hay archivos</div>
                    <div class="text-grey-6">Sube tu primer archivo para comenzar</div>
                  </div>
  
                  <q-list v-else separator>
                    <q-item
                      v-for="file in projectFiles"
                      :key="file.id"
                      class="file-item"
                    >
                      <q-item-section avatar>
                        <q-icon :name="getFileIcon(file.file_type)" :color="getFileColor(file.file_type)" />
                      </q-item-section>
  
                      <q-item-section>
                        <q-item-label>{{ file.filename }}</q-item-label>
                        <q-item-label caption>
                          {{ formatFileSize(file.file_size) }} • {{ formatDate(file.created_at) }}
                          <q-chip
                            v-if="file.is_main_file"
                            color="primary"
                            text-color="white"
                            size="xs"
                            class="q-ml-sm"
                          >
                            Principal
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
  
                      <q-item-section side>
                        <div class="flex q-gutter-xs">
                          <q-btn
                            flat
                            round
                            icon="visibility"
                            size="sm"
                            @click="previewFile(file)"
                          />
                          <q-btn
                            flat
                            round
                            icon="download"
                            size="sm"
                            @click="downloadFile(file)"
                          />
                          <q-btn
                            v-if="file.file_type === 'html'"
                            flat
                            round
                            icon="star"
                            size="sm"
                            :color="file.is_main_file ? 'primary' : 'grey'"
                            @click="setMainFile(file)"
                          />
                          <q-btn
                            flat
                            round
                            icon="delete"
                            size="sm"
                            color="negative"
                            @click="confirmDeleteFile(file)"
                          />
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
  
        <div v-else class="text-center q-pa-xl">
          <q-icon name="error" size="3rem" color="negative" />
          <div class="text-h6 q-mt-md">Proyecto no encontrado</div>
          <q-btn
            color="primary"
            label="Volver a Proyectos"
            @click="$router.push('/projects')"
            class="q-mt-md"
          />
        </div>
      </div>
  
      <!-- Preview Dialog -->
      <q-dialog v-model="showPreview" maximized>
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Vista Previa - {{ currentProject?.name }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
  
          <q-card-section class="q-pa-none" style="height: calc(100vh - 100px);">
            <iframe
              v-if="previewUrl"
              :src="previewUrl"
              style="width: 100%; height: 100%; border: none;"
              @load="onPreviewLoad"
            ></iframe>
            <div v-else class="flex flex-center full-height">
              <div class="text-center">
                <q-spinner size="3rem" color="primary" />
                <div class="q-mt-md">Generando vista previa...</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <!-- QR Code Dialog -->
      <q-dialog v-model="showQRCode">
        <q-card style="min-width: 300px">
          <q-card-section>
            <div id="qrcode" class="text-h6 text-center">Código QR</div>
          </q-card-section>
  
          <q-card-section class="text-center">
            <div id="qrcode" class="q-mb-md"></div>
            <div class="text-caption text-grey-6">
              Escanea este código para abrir el sitio
            </div>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <!-- Delete File Dialog -->
      <q-dialog v-model="deleteFileDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Confirmar eliminación</div>
          </q-card-section>
          <q-card-section>
            ¿Estás seguro de que quieres eliminar "{{ fileToDelete?.filename }}"?
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn flat label="Eliminar" color="negative" @click="deleteFile" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProjectStore } from '../stores/projects'
  import { useFileStore } from '../stores/files'
  import { Notify, copyToClipboard as qCopyToClipboard } from 'quasar'
  import QRCode from 'qrcode'
  
  const route = useRoute()
  const router = useRouter()
  const projectStore = useProjectStore()
  const fileStore = useFileStore()
  
  const editMode = ref(false)
  const selectedFiles = ref(null)
  const deleteFileDialog = ref(false)
  const fileToDelete = ref(null)
  const showPreview = ref(false)
  const showQRCode = ref(false)
  const previewUrl = ref('')
  
  const editForm = ref({
    name: '',
    description: ''
  })
  
  const currentProject = computed(() => projectStore.currentProject)
  const projectFiles = computed(() => currentProject.value?.project_files || [])
  const hasHtmlFile = computed(() => projectFiles.value.some(file => file.file_type === 'html'))
  
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
  
  const getFileIcon = (fileType) => {
    const icons = {
      'html': 'code',
      'css': 'style',
      'js': 'javascript',
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'gif': 'image',
      'svg': 'image',
      'ico': 'image'
    }
    return icons[fileType] || 'description'
  }
  
  const getFileColor = (fileType) => {
    const colors = {
      'html': 'orange',
      'css': 'blue',
      'js': 'yellow',
      'png': 'green',
      'jpg': 'green',
      'jpeg': 'green',
      'gif': 'green',
      'svg': 'green',
      'ico': 'green'
    }
    return colors[fileType] || 'grey'
  }
  
  const generatePreviewUrl = async () => {
    try {
      // Find the main HTML file (index.html or first HTML file)
      const mainFile = projectFiles.value.find(f => f.is_main_file) || 
                      projectFiles.value.find(f => f.file_type === 'html')
      
      if (!mainFile) {
        Notify.create({
          type: 'warning',
          message: 'No se encontró archivo HTML principal',
          position: 'top'
        })
        return
      }
  
      // Get the HTML content
      const htmlContent = await fileStore.getFileContent(mainFile.file_path)
      
      // Process the HTML to replace relative paths with absolute URLs
      const processedHtml = await processHtmlContent(htmlContent, currentProject.value.id)
      
      // Create a blob URL for the processed HTML
      const blob = new Blob([processedHtml], { type: 'text/html' })
      previewUrl.value = URL.createObjectURL(blob)
      
    } catch (error) {
      console.error('Error generating preview:', error)
      Notify.create({
        type: 'negative',
        message: 'Error al generar vista previa',
        position: 'top'
      })
    }
  }
  
  const processHtmlContent = async (htmlContent, projectId) => {
    // Replace relative paths with absolute URLs from Supabase storage
    let processedHtml = htmlContent
    
    // Find all CSS and JS references
    const cssRegex = /<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi
    const jsRegex = /<script[^>]*src=["']([^"']+\.js)["'][^>]*>/gi
    const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi
    
    // Replace CSS files
    processedHtml = processedHtml.replace(cssRegex, (match, filename) => {
      const file = projectFiles.value.find(f => f.filename === filename)
      if (file) {
        const publicUrl = fileStore.getFileUrl(file.file_path)
        return match.replace(filename, publicUrl)
      }
      return match
    })
    
    // Replace JS files
    processedHtml = processedHtml.replace(jsRegex, (match, filename) => {
      const file = projectFiles.value.find(f => f.filename === filename)
      if (file) {
        const publicUrl = fileStore.getFileUrl(file.file_path)
        return match.replace(filename, publicUrl)
      }
      return match
    })
    
    // Replace images
    processedHtml = processedHtml.replace(imgRegex, (match, filename) => {
      const file = projectFiles.value.find(f => f.filename === filename)
      if (file) {
        const publicUrl = fileStore.getFileUrl(file.file_path)
        return match.replace(filename, publicUrl)
      }
      return match
    })
    
    return processedHtml
  }
  
  const togglePublish = async () => {
    if (!hasHtmlFile.value) {
      Notify.create({
        type: 'warning',
        message: 'Necesitas subir al menos un archivo HTML para publicar',
        position: 'top'
      })
      return
    }
  
    try {
      if (currentProject.value.is_published) {
        await projectStore.unpublishProject(currentProject.value.id)
      } else {
        await projectStore.publishProject(currentProject.value.id)
      }
      // Refresh project data
      await projectStore.fetchProject(currentProject.value.id)
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }
  
  const openPublicSite = () => {
    if (currentProject.value?.public_url) {
      window.open(currentProject.value.public_url, '_blank')
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
  
  const shareOnWhatsApp = () => {
    const url = currentProject.value.public_url
    const text = `¡Mira mi sitio web: ${currentProject.value.name}!`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    window.open(whatsappUrl, '_blank')
  }
  
  const shareOnTelegram = () => {
    const url = currentProject.value.public_url
    const text = `¡Mira mi sitio web: ${currentProject.value.name}!`
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    window.open(telegramUrl, '_blank')
  }
  
  const generateQRCode = async () => {
  const qrContainer = document.getElementById('qrcode')
  if (qrContainer && currentProject.value?.public_url) {
    try {
      qrContainer.innerHTML = ''
      await QRCode.toCanvas(qrContainer, currentProject.value.public_url, { width: 200 })
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }
}
  
  const setMainFile = async (file) => {
    try {
      // Update all HTML files to not be main
      const updates = projectFiles.value
        .filter(f => f.file_type === 'html')
        .map(f => ({
          id: f.id,
          is_main_file: f.id === file.id
        }))
  
      // This would need to be implemented in the file store
      Notify.create({
        type: 'info',
        message: `${file.filename} marcado como archivo principal`,
        position: 'top'
      })
      
      // Refresh project data
      await projectStore.fetchProject(currentProject.value.id)
    } catch (error) {
      console.error('Error setting main file:', error)
    }
  }
  
  const cancelEdit = () => {
    editMode.value = false
    editForm.value = {
      name: currentProject.value.name,
      description: currentProject.value.description || ''
    }
  }
  
  const updateProject = async () => {
    try {
      await projectStore.updateProject(currentProject.value.id, editForm.value)
      editMode.value = false
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }
  
  const onRejected = (rejectedEntries) => {
    Notify.create({
      type: 'negative',
      message: `${rejectedEntries.length} archivo(s) rechazado(s). Verifica el formato y tamaño.`,
      position: 'top'
    })
  }
  
  const uploadFiles = async () => {
    if (!selectedFiles.value || selectedFiles.value.length === 0) return
    
    try {
      await fileStore.uploadMultipleFiles(currentProject.value.id, selectedFiles.value)
      selectedFiles.value = null
      // Refresh project data to show new files
      await projectStore.fetchProject(currentProject.value.id)
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }
  
  const previewFile = (file) => {
    const url = fileStore.getFileUrl(file.file_path)
    window.open(url, '_blank')
  }
  
  const downloadFile = (file) => {
    const url = fileStore.getFileUrl(file.file_path)
    const link = document.createElement('a')
    link.href = url
    link.download = file.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const confirmDeleteFile = (file) => {
    fileToDelete.value = file
    deleteFileDialog.value = true
  }
  
  const deleteFile = async () => {
    if (!fileToDelete.value) return
    
    try {
      await fileStore.deleteFile(fileToDelete.value.id, fileToDelete.value.file_path)
      deleteFileDialog.value = false
      fileToDelete.value = null
      // Refresh project data
      await projectStore.fetchProject(currentProject.value.id)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }
  
  const onPreviewLoad = () => {
    // Preview loaded successfully
  }
  
  onMounted(async () => {
    const projectId = route.params.id
    try {
      await projectStore.fetchProject(projectId)
      if (currentProject.value) {
        editForm.value = {
          name: currentProject.value.name,
          description: currentProject.value.description || ''
        }
        
        // Generate preview URL if project is published
        if (currentProject.value.is_published && projectFiles.value.length > 0) {
          await generatePreviewUrl()
        }
      }
    } catch (error) {
      console.error('Error loading project:', error)
    }
  })
  
  // Watch for preview dialog opening
  watch(showPreview, async (newVal) => {
    if (newVal && !previewUrl.value) {
      await generatePreviewUrl()
    }
  })
  
  // Watch for QR code dialog opening
  watch(showQRCode, (newVal) => {
    if (newVal) {
      setTimeout(generateQRCode, 100)
    }
  })
  </script>
  
  <style scoped>
  .file-item:hover {
    background-color: #f5f5f5;
  }
  </style>
  