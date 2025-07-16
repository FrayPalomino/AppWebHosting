import { ref } from "vue"
import { defineStore } from "pinia"
import { supabase } from "../boot/supabase"
import { useAuthStore } from "./auth"
import { Notify } from "quasar"

export const useProjectStore = defineStore("projects", () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)

  const authStore = useAuthStore()

  const fetchProjects = async () => {
    try {
      loading.value = true

      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_files (
            id,
            filename,
            file_size
          )
        `)
        .eq("user_id", authStore.user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error

      projects.value = data.map((project) => ({
        ...project,
        file_count: project.project_files?.length || 0,
        total_size: project.project_files?.reduce((sum, file) => sum + (file.file_size || 0), 0) || 0,
      }))

      return projects.value
    } catch (error) {
      console.error("Error fetching projects:", error)
      Notify.create({
        type: "negative",
        message: "Error al cargar proyectos",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async (projectId) => {
    try {
      loading.value = true

      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_files (*)
        `)
        .eq("id", projectId)
        .eq("user_id", authStore.user.id)
        .single()

      if (error) throw error

      currentProject.value = data
      return data
    } catch (error) {
      console.error("Error fetching project:", error)
      Notify.create({
        type: "negative",
        message: "Error al cargar proyecto",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData) => {
    try {
      loading.value = true

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            ...projectData,
            user_id: authStore.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      projects.value.unshift(data)

      Notify.create({
        type: "positive",
        message: "Proyecto creado exitosamente",
        position: "top",
      })

      return data
    } catch (error) {
      console.error("Error creating project:", error)
      Notify.create({
        type: "negative",
        message: "Error al crear proyecto",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (projectId, updates) => {
    try {
      loading.value = true

      const { data, error } = await supabase
        .from("projects")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", authStore.user.id)
        .select()
        .single()

      if (error) throw error

      const index = projects.value.findIndex((p) => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = data
      }

      if (currentProject.value?.id === projectId) {
        currentProject.value = { ...currentProject.value, ...data }
      }

      Notify.create({
        type: "positive",
        message: "Proyecto actualizado correctamente",
        position: "top",
      })

      return data
    } catch (error) {
      console.error("Error updating project:", error)
      Notify.create({
        type: "negative",
        message: "Error al actualizar proyecto",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (projectId) => {
    try {
      loading.value = true

      const { data: files } = await supabase.from("project_files").select("file_path").eq("project_id", projectId)

      if (files && files.length > 0) {
        const filePaths = files.map((f) => f.file_path)
        await supabase.storage.from("project-files").remove(filePaths)
      }

      const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", authStore.user.id)

      if (error) throw error
      projects.value = projects.value.filter((p) => p.id !== projectId)

      if (currentProject.value?.id === projectId) {
        currentProject.value = null
      }

      Notify.create({
        type: "positive",
        message: "Proyecto eliminado correctamente",
        position: "top",
      })

      return true
    } catch (error) {
      console.error("Error deleting project:", error)
      Notify.create({
        type: "negative",
        message: "Error al eliminar proyecto",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const publishProject = async (projectId) => {
    try {
      loading.value = true

      const publicUrl = `${window.location.origin}/#/site/${projectId}`

      const { data, error } = await supabase
        .from("projects")
        .update({
          is_published: true,
          public_url: publicUrl,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", authStore.user.id)
        .select()
        .single()

      if (error) throw error

      const index = projects.value.findIndex((p) => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = data
      }

      if (currentProject.value?.id === projectId) {
        currentProject.value = { ...currentProject.value, ...data }
      }

      Notify.create({
        type: "positive",
        message: "Proyecto publicado exitosamente",
        position: "top",
      })

      return data
    } catch (error) {
      console.error("Error publishing project:", error)
      Notify.create({
        type: "negative",
        message: "Error al publicar proyecto",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const unpublishProject = async (projectId) => {
    try {
      loading.value = true

      const { data, error } = await supabase
        .from("projects")
        .update({
          is_published: false,
          public_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", authStore.user.id)
        .select()
        .single()

      if (error) throw error

      const index = projects.value.findIndex((p) => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = data
      }

      if (currentProject.value?.id === projectId) {
        currentProject.value = { ...currentProject.value, ...data }
      }

      Notify.create({
        type: "positive",
        message: "Proyecto despublicado correctamente",
        position: "top",
      })

      return data
    } catch (error) {
      console.error("Error unpublishing project:", error)
      Notify.create({
        type: "negative",
        message: "Error al despublicar proyecto",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    currentProject,
    loading,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    publishProject,
    unpublishProject,
  }
})
