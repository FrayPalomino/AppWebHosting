<template>
    <q-page>
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner size="3rem" color="primary" />
        <div class="q-mt-md">Cargando sitio...</div>
      </div>
  
      <div v-else-if="error" class="text-center q-pa-xl">
        <q-icon name="error" size="4rem" color="negative" />
        <div class="text-h5 q-mt-md">Sitio no encontrado</div>
        <div class="text-grey-6 q-mb-md">
          El sitio que buscas no existe o no está publicado
        </div>
        <q-btn
          color="primary"
          label="Ir al inicio"
          @click="$router.push('/')"
        />
      </div>
  
      <div v-else-if="siteContent" class="full-height">
        <!-- Render the actual HTML content -->
        <div v-html="siteContent" class="site-content"></div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { supabase } from '../boot/supabase'
  
  const route = useRoute()
  
  const loading = ref(true)
  const error = ref(false)
  const project = ref(null)
  const siteContent = ref('')
  
  const loadPublicSite = async () => {
    try {
      loading.value = true
      const projectId = route.params.id
  
      // Fetch public project (no auth required)
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          is_published,
          published_at,
          project_files (
            filename,
            file_type,
            file_path,
            is_main_file
          )
        `)
        .eq('id', projectId)
        .eq('is_published', true)
        .single()
  
      if (fetchError || !data) {
        error.value = true
        return
      }
  
      project.value = data
  
      // Find the main HTML file
      const mainFile = data.project_files.find(f => f.is_main_file) || 
                      data.project_files.find(f => f.file_type === 'html')
  
      if (!mainFile) {
        error.value = true
        return
      }
  
      // Get the HTML content
      const { data: fileData, error: fileError } = await supabase.storage
        .from('project-files')
        .download(mainFile.file_path)
  
      if (fileError) {
        error.value = true
        return
      }
  
      let htmlContent = await fileData.text()
  
      // Process the HTML to replace relative paths with absolute URLs
      htmlContent = await processHtmlContent(htmlContent, data.project_files)
  
      siteContent.value = htmlContent
  
    } catch (err) {
      console.error('Error loading public site:', err)
      error.value = true
    } finally {
      loading.value = false
    }
  }
  
  const processHtmlContent = async (htmlContent, projectFiles) => {
    let processedHtml = htmlContent
  
    // Get public URLs for all files
    const fileUrls = {}
    projectFiles.forEach(file => {
      const { data } = supabase.storage.from('project-files').getPublicUrl(file.file_path)
      fileUrls[file.filename] = data.publicUrl
    })
  
    // Replace relative paths with absolute URLs
    const cssRegex = /<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi
    const jsRegex = /<script[^>]*src=["']([^"']+\.js)["'][^>]*>/gi
    const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi
  
    // Replace CSS files
    processedHtml = processedHtml.replace(cssRegex, (match, filename) => {
      if (fileUrls[filename]) {
        return match.replace(filename, fileUrls[filename])
      }
      return match
    })
  
    // Replace JS files
    processedHtml = processedHtml.replace(jsRegex, (match, filename) => {
      if (fileUrls[filename]) {
        return match.replace(filename, fileUrls[filename])
      }
      return match
    })
  
    // Replace images
    processedHtml = processedHtml.replace(imgRegex, (match, filename) => {
      if (fileUrls[filename]) {
        return match.replace(filename, fileUrls[filename])
      }
      return match
    })
  
    return processedHtml
  }
  
  onMounted(() => {
    loadPublicSite()
  })
  </script>
  
  <style scoped>
  .full-height {
    min-height: 100vh;
  }
  
  .site-content {
    width: 100%;
    height: 100%;
  }
  
  /* Reset some styles that might interfere with the rendered site */
  .site-content * {
    box-sizing: border-box;
  }
  </style>
  