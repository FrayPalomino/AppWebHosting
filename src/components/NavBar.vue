<template>
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <router-link to="/dashboard" class="navbar-brand">
            StaticSite Manager
          </router-link>
  
          <div class="navbar-nav">
            <router-link to="/dashboard" class="nav-link">
              Dashboard
            </router-link>
            <router-link to="/projects" class="nav-link">
              Proyectos
            </router-link>
            <router-link to="/profile" class="nav-link">
              Perfil
            </router-link>
            
            <div class="user-menu">
              <button @click="showUserMenu = !showUserMenu" class="user-button">
                <div class="user-avatar">
                  {{ userInitials }}
                </div>
                <span>{{ user?.email }}</span>
              </button>
  
              <div v-if="showUserMenu" class="user-dropdown">
                <router-link to="/profile" class="dropdown-item">
                  Mi Perfil
                </router-link>
                <button @click="handleLogout" class="dropdown-item logout">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useAuthStore } from '../stores/auth'
  
  const authStore = useAuthStore()
  const showUserMenu = ref(false)
  
  const user = computed(() => authStore.user)
  
  const userInitials = computed(() => {
    if (!user.value?.email) return 'U'
    return user.value.email.charAt(0).toUpperCase()
  })
  
  const handleLogout = async () => {
    await authStore.signOut()
    showUserMenu.value = false
  }
  
  const closeUserMenu = (event) => {
    if (!event.target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', closeUserMenu)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', closeUserMenu)
  })
  </script>
  
  <style scoped>
  .user-menu {
    position: relative;
  }
  
  .user-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
  }
  
  .user-button:hover {
    background: #f1f5f9;
  }
  
  .user-avatar {
    width: 2rem;
    height: 2rem;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    min-width: 12rem;
    z-index: 50;
    margin-top: 0.25rem;
  }
  
  .dropdown-item {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    color: #374151;
    text-decoration: none;
    border: none;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .dropdown-item:hover {
    background: #f9fafb;
  }
  
  .dropdown-item:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  
  .dropdown-item:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
  
  .logout {
    color: #ef4444;
    border-top: 1px solid #e5e7eb;
  }
  
  .logout:hover {
    background: #fef2f2;
  }
  </style>
  