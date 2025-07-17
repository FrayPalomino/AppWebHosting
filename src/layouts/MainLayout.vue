<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="modern-header">
      <q-toolbar class="toolbar-container">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Alternar menú de navegación"
          @click="toggleLeftDrawer"
          class="menu-btn"
        />

        <q-toolbar-title class="app-title">
          <q-icon name="web" class="title-icon" />
          Hostifly
        </q-toolbar-title>

        <q-space />

        <q-btn-dropdown
          flat
          stretch
          :label="userEmail"
          icon="account_circle"
          aria-label="Menú de usuario"
          dropdown-icon="expand_more"
          class="user-dropdown"
        >
          <q-list dense padding class="user-menu">
            <q-item 
              clickable 
              v-close-popup 
              @click="navigateTo('/profile')"
              class="menu-item profile-item"
            >
              <q-item-section avatar>
                <q-icon name="person" class="menu-icon" />
              </q-item-section>
              <q-item-section>Mi Perfil</q-item-section>
            </q-item>

            <q-separator class="menu-separator" />

            <q-item 
              clickable 
              v-close-popup 
              @click="handleLogout"
              class="menu-item logout-item"
            >
              <q-item-section avatar>
                <q-icon name="logout" class="menu-icon" />
              </q-item-section>
              <q-item-section>Cerrar Sesión</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="300"
      class="modern-drawer"
    >
      <div class="drawer-header">
        <div class="drawer-title">
          <q-icon name="dashboard" class="drawer-icon" />
          <span class="drawer-text">Navegación</span>
        </div>
      </div>

      <q-scroll-area class="drawer-scroll">
        <q-list class="navigation-list">
          <EssentialLink
            v-for="link in filteredEssentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="modern-page-container">
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const userEmail = computed(() => authStore.user?.email || 'Usuario')

const essentialLinks = [
  {
    title: 'Dashboard',
    caption: 'Resumen general',
    icon: 'dashboard',
    link: '/dashboard',
    visible: true
  },
  {
    title: 'Proyectos',
    caption: 'Gestionar proyectos',
    icon: 'folder',
    link: '/projects',
    visible: true
  },
  {
    title: 'Nuevo Proyecto',
    caption: 'Crear proyecto',
    icon: 'add_circle',
    link: '/projects/new',
    visible: authStore.user?.canCreateProjects 
  },
  {
    title: 'Mi Perfil',
    caption: 'Configuración personal',
    icon: 'person',
    link: '/profile',
    visible: true
  }
]

const filteredEssentialLinks = computed(() => 
  essentialLinks.filter(link => link.visible !== false)
)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navigateTo = (path) => {
  router.push(path)
}

const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<style lang="scss" scoped>
$primary-gradient: linear-gradient(135deg, #1F7D53 0%, #2a7242 100%);
$secondary-gradient: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
$dark-gradient: linear-gradient(135deg, #1f2937 0%, #374151 100%);
$success-color: #10b981;
$warning-color: #f59e0b;
$error-color: #ef4444;
$background-color: #0f172a;
$surface-color: #1e293b;
$surface-lighter: #334155;
$text-primary: #212121;
$text-secondary: #2c2e31;
$border-color: #475569;

.modern-header {
  background: $dark-gradient;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $border-color;
  
  .toolbar-container {
    padding: 0 24px;
    min-height: 64px;
  }
  
  .menu-btn {
    color: #f1f5f9;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }
  }
  
  .app-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    gap: 12px;
    letter-spacing: -0.025em;
    
    .title-icon {
      font-size: 1.75rem;
      color: #1F7D53;
    }
  }
  
  .user-dropdown {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 8px 16px;
    color: #f1f5f9;
    font-weight: 500;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
    
    :deep(.q-btn__content) {
      justify-content: space-between;
      gap: 8px;
    }
  }
}

.user-menu {
  background: $surface-color;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid $border-color;
  min-width: 200px;
  
  .menu-item {
    padding: 12px 16px;
    margin: 4px 8px;
    border-radius: 8px;
    color: #f1f5f9;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      background: linear-gradient(135deg, #18230F 0%, #4b5563 100%);
      transform: translateX(4px);
    }
    
    &.profile-item:hover {
      background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
      color: #93c5fd;
    }
    
    &.logout-item:hover {
      background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
      color: #fca5a5;
    }
    
    .menu-icon {
      font-size: 1.2rem;
    }
  }
  
  .menu-separator {
    margin: 8px 0;
    background: $border-color;
  }
}

.modern-drawer {
  background: $surface-color;
  border-right: 1px solid $border-color;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
  
  .drawer-header {
    padding: 24px 20px 16px;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-bottom: 1px solid $border-color;
    
    .drawer-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 1.1rem;
      color: #f1f5f9;
      
      .drawer-icon {
        font-size: 1.5rem;
        color: #1F7D53;
      }
    }
  }
  
  .drawer-scroll {
    height: calc(100vh - 120px);
  }
  
  .navigation-list {
    padding: 16px 12px;
    
    :deep(.q-item) {
      padding: 12px 16px;
      margin: 6px 0;
      border-radius: 12px;
      color: $text-primary;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s ease;
      }
      
      &:hover {
        background: linear-gradient(135deg, #b2b8c2 0%, #929ead 100%);
        transform: translateX(8px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        
        &::before {
          left: 100%;
        }
      }
      
      &.q-router-link--active {
        background: $primary-gradient;
        color: white;
        box-shadow: 0 4px 16px rgba(70, 229, 210, 0.4);
        
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 0 2px 2px 0;
        }
      }
    }
  }
}

.modern-page-container {
  background: $background-color;
  min-height: 100vh;
}
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 768px) {
  .modern-header .toolbar-container {
    padding: 0 16px;
  }
  
  .modern-drawer {
    .drawer-header {
      padding: 20px 16px 12px;
    }
  }
  
  .user-dropdown {
    padding: 6px 12px !important;
    font-size: 0.9rem;
  }
}

:deep(.q-scrollarea__thumb) {
  background: rgba(79, 70, 229, 0.4);
  border-radius: 4px;
  
  &:hover {
    background: rgba(79, 70, 229, 0.6);
  }
}
</style>