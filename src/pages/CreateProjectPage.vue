<template>
  <q-page class="create-project-page">
    <div class="page-container">
      <!-- Header con gradiente -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Crear Nuevo Proyecto</h1>
          <p class="page-subtitle">Completa la información básica de tu proyecto</p>
        </div>
        <div class="header-decoration">
          <div class="floating-shape shape-1"></div>
          <div class="floating-shape shape-2"></div>
          <div class="floating-shape shape-3"></div>
        </div>
      </div>

      <!-- Formulario principal -->
      <div class="form-container">
        <div class="form-card">
          <q-form @submit="handleSubmit" class="modern-form">
            
            <!-- Sección: Información básica -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <q-icon name="info" size="1.5rem" />
                </div>
                <div class="section-title">Información Básica</div>
              </div>
              
              <div class="form-group">
                <q-input
                  v-model="form.name"
                  label="Nombre del Proyecto"
                  outlined
                  class="modern-input"
                  :rules="[val => !!val || 'El nombre es requerido']"
                  lazy-rules
                >
                  <template v-slot:prepend>
                    <q-icon name="folder" />
                  </template>
                </q-input>
              </div>

              <div class="form-group">
                <q-input
                  v-model="form.description"
                  label="Descripción"
                  outlined
                  type="textarea"
                  rows="3"
                  class="modern-input"
                  hint="Describe brevemente tu proyecto"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Sección: Configuración inicial -->
            <div class="form-section">
              <div class="section-header">
                <div class="section-icon">
                  <q-icon name="settings" size="1.5rem" />
                </div>
                <div class="section-title">Configuración Inicial</div>
              </div>

              <div class="toggle-group">
                <div class="toggle-item">
                  <q-toggle
                    v-model="form.createIndexFile"
                    color="primary"
                    class="modern-toggle"
                  />
                  <div class="toggle-content">
                    <div class="toggle-label">Crear archivo index.html básico</div>
                    <div class="toggle-description">Genera un archivo HTML inicial con estructura básica</div>
                  </div>
                </div>

                <div class="toggle-item">
                  <q-toggle
                    v-model="form.createStyleFile"
                    color="primary"
                    class="modern-toggle"
                  />
                  <div class="toggle-content">
                    <div class="toggle-label">Crear archivo style.css básico</div>
                    <div class="toggle-description">Incluye estilos CSS básicos para comenzar</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección: Plantilla (condicional) -->
            <div v-if="form.createIndexFile" class="form-section template-section">
              <div class="section-header">
                <div class="section-icon">
                  <q-icon name="web" size="1.5rem" />
                </div>
                <div class="section-title">Plantilla HTML</div>
              </div>

              <div class="template-grid">
                <div
                  v-for="template in templateOptions"
                  :key="template.value"
                  class="template-card"
                  :class="{ 'template-selected': form.template === template.value }"
                  @click="form.template = template.value"
                >
                  <div class="template-icon">
                    <q-icon :name="template.icon" size="2rem" />
                  </div>
                  <div class="template-info">
                    <div class="template-name">{{ template.label }}</div>
                    <div class="template-description">{{ template.description }}</div>
                  </div>
                  <div class="template-indicator">
                    <q-icon 
                      name="check_circle" 
                      size="1.2rem" 
                      v-if="form.template === template.value"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones del formulario -->
            <div class="form-actions">
              <q-btn
                flat
                label="Cancelar"
                class="cancel-btn"
                no-caps
                @click="$router.push('/projects')"
              />
              <q-btn
                type="submit"
                label="Crear Proyecto"
                class="submit-btn"
                no-caps
                :loading="projectStore.loading"
                :disable="projectStore.loading"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Creando...
                </template>
              </q-btn>
            </div>
          </q-form>
        </div>

        <!-- Panel lateral con preview -->
        <div class="preview-panel">
          <div class="preview-header">
            <h3>Vista previa</h3>
            <q-icon name="visibility" />
          </div>
          
          <div class="preview-content">
            <div class="project-preview">
              <div class="preview-item">
                <q-icon name="folder" color="primary" />
                <span>{{ form.name || 'Nombre del proyecto' }}</span>
              </div>
              
              <div class="preview-item" v-if="form.description">
                <q-icon name="description" color="grey-6" />
                <span>{{ form.description }}</span>
              </div>
              
              <div class="preview-files">
                <div class="file-item" v-if="form.createIndexFile">
                  <q-icon name="code" color="orange" />
                  <span>index.html</span>
                  <q-chip size="sm" color="primary" text-color="white">
                    {{ templateOptions.find(t => t.value === form.template)?.label }}
                  </q-chip>
                </div>
                
                <div class="file-item" v-if="form.createStyleFile">
                  <q-icon name="style" color="blue" />
                  <span>style.css</span>
                  <q-chip size="sm" color="info" text-color="white">CSS</q-chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../stores/projects'

const router = useRouter()
const projectStore = useProjectStore()

const form = ref({
  name: '',
  description: '',
  createIndexFile: true,
  createStyleFile: true,
  template: 'basic'
})

const templateOptions = [
  { 
    label: 'Básico', 
    value: 'basic',
    icon: 'article',
    description: 'Estructura HTML simple y limpia'
  },
  { 
    label: 'Landing Page', 
    value: 'landing',
    icon: 'rocket_launch',
    description: 'Página de destino con call-to-action'
  },
  { 
    label: 'Portfolio', 
    value: 'portfolio',
    icon: 'work',
    description: 'Portafolio personal o profesional'
  },
  { 
    label: 'Blog', 
    value: 'blog',
    icon: 'edit_note',
    description: 'Estructura de blog con artículos'
  }
]

const templates = {
  basic: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Sitio Web</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Bienvenido a mi sitio web</h1>
    </header>
    
    <main>
        <section>
            <h2>Acerca de</h2>
            <p>Este es mi sitio web creado con Static Site Manager.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Mi Sitio Web. Todos los derechos reservados.</p>
    </footer>
</body>
</html>`,
  
  landing: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="hero">
        <div class="container">
            <h1>Tu Producto Increíble</h1>
            <p>La solución que estabas buscando</p>
            <button class="cta-button">Comenzar Ahora</button>
        </div>
    </header>
    
    <section class="features">
        <div class="container">
            <h2>Características</h2>
            <div class="feature-grid">
                <div class="feature">
                    <h3>Fácil de usar</h3>
                    <p>Interfaz intuitiva y amigable</p>
                </div>
                <div class="feature">
                    <h3>Rápido</h3>
                    <p>Optimizado para velocidad</p>
                </div>
                <div class="feature">
                    <h3>Seguro</h3>
                    <p>Protección de datos garantizada</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`,

  portfolio: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <div class="container">
            <h1>Mi Nombre</h1>
            <ul>
                <li><a href="#about">Acerca</a></li>
                <li><a href="#projects">Proyectos</a></li>
                <li><a href="#contact">Contacto</a></li>
            </ul>
        </div>
    </nav>
    
    <section id="about" class="about">
        <div class="container">
            <h2>Acerca de mí</h2>
            <p>Soy un desarrollador apasionado por crear experiencias digitales increíbles.</p>
        </div>
    </section>
    
    <section id="projects" class="projects">
        <div class="container">
            <h2>Mis Proyectos</h2>
            <div class="project-grid">
                <div class="project">
                    <h3>Proyecto 1</h3>
                    <p>Descripción del proyecto</p>
                </div>
                <div class="project">
                    <h3>Proyecto 2</h3>
                    <p>Descripción del proyecto</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`,

  blog: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Blog</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Mi Blog</h1>
            <nav>
                <ul>
                    <li><a href="#home">Inicio</a></li>
                    <li><a href="#about">Acerca</a></li>
                    <li><a href="#contact">Contacto</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main class="container">
        <article class="post">
            <h2>Mi primer post</h2>
            <p class="meta">Publicado el 1 de enero, 2024</p>
            <p>Este es el contenido de mi primer post en el blog...</p>
        </article>
        
        <article class="post">
            <h2>Segundo post</h2>
            <p class="meta">Publicado el 15 de enero, 2024</p>
            <p>Contenido del segundo post...</p>
        </article>
    </main>
</body>
</html>`
}

const basicCSS = `/* Reset básico */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

header {
    background: #f8f9fa;
    padding: 2rem 0;
    text-align: center;
}

main {
    padding: 2rem 0;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem 0;
    margin-top: 2rem;
}

h1, h2, h3 {
    margin-bottom: 1rem;
}

p {
    margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
}`

const handleSubmit = async () => {
  try {
    const project = await projectStore.createProject({
      name: form.value.name,
      description: form.value.description
    })

    // Create initial files if requested
    if (form.value.createIndexFile) {
      console.log('Creating index.html with template:', form.value.template)
    }

    if (form.value.createStyleFile) {
      console.log('Creating style.css')
    }

    router.push(`/projects/${project.id}`)
  } catch (error) {
    console.error('Error creating project:', error)
  }
}
</script>

<style scoped>
.create-project-page {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  color: #e2e8f0;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.page-header {
  position: relative;
  background: linear-gradient(135deg, #1F7D53 0%, #2a7242 100%);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 3rem;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 2;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-2px);
}

.breadcrumb-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: -50px;
  right: 100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  bottom: -30px;
  right: 50px;
  animation-delay: 3s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 60px;
  right: -40px;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Form Container */
.form-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

.form-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

/* Form Sections */
.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1F7D53 0%, #2a7242 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.modern-input {
  margin-bottom: 1rem;
}

.modern-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.modern-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.8);
}

.modern-input :deep(.q-field__native) {
  color: white;
}

.modern-input :deep(.q-icon) {
  color: rgba(255, 255, 255, 0.6);
}

/* Toggle Groups */
.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toggle-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.toggle-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
}

.toggle-content {
  flex: 1;
}

.toggle-label {
  font-weight: 500;
  color: white;
  margin-bottom: 0.25rem;
}

.toggle-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Template Grid */
.template-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.template-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.template-card:hover {
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.template-selected {
  border-color: #2a7242;
  background: rgba(102, 126, 234, 0.1);
}

.template-icon {
  color: #2a7242;
  text-align: center;
}

.template-name {
  font-weight: 600;
  color: white;
  text-align: center;
}

.template-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.template-indicator {
  text-align: center;
  color: #2a7242;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.submit-btn {
  background: linear-gradient(135deg, #2a7242 0%, #1F7D53 100%);
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

/* Preview Panel */
.preview-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-header h3 {
  color: white;
  margin: 0;
}

.preview-content {
  color: rgba(255, 255, 255, 0.8);
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.preview-files {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
  }
  
  .preview-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .form-card {
    padding: 1.5rem;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>