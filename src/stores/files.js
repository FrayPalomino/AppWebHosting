import { ref } from "vue"
import { defineStore } from "pinia"
import { supabase } from "../boot/supabase"
import { useAuthStore } from "./auth"
import { Notify } from "quasar"

export const useFileStore = defineStore("files", () => {
  const loading = ref(false)
  const uploadProgress = ref(0)

  const authStore = useAuthStore()

  const uploadFile = async (projectId, file) => {
    try {
      loading.value = true
      uploadProgress.value = 0

      const filePath = `${authStore.user.id}/${projectId}/${file.name}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) throw uploadError

      const fileExtension = file.name.split(".").pop().toLowerCase()
      const mimeType = file.type || getMimeType(fileExtension)

      const { data: fileData, error: dbError } = await supabase
        .from("project_files")
        .insert([
          {
            project_id: projectId,
            filename: file.name,
            file_path: filePath,
            file_type: fileExtension,
            file_size: file.size,
            mime_type: mimeType,
            is_main_file: fileExtension === "html" && file.name.toLowerCase().includes("index"),
          },
        ])
        .select()
        .single()

      if (dbError) throw dbError

      Notify.create({
        type: "positive",
        message: `Archivo ${file.name} subido correctamente`,
        position: "top",
      })

      return fileData
    } catch (error) {
      console.error("Error uploading file:", error)
      Notify.create({
        type: "negative",
        message: `Error al subir ${file.name}: ${error.message}`,
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
      uploadProgress.value = 0
    }
  }

  const uploadMultipleFiles = async (projectId, files) => {
    const results = []
    const total = files.length

    for (let i = 0; i < files.length; i++) {
      try {
        uploadProgress.value = Math.round(((i + 1) / total) * 100)
        const result = await uploadFile(projectId, files[i])
        results.push(result)
      } catch (error) {
        console.error(`Error uploading file ${files[i].name}:`, error)
      }
    }

    return results
  }

  const deleteFile = async (fileId, filePath) => {
    try {
      loading.value = true

      const { error: storageError } = await supabase.storage.from("project-files").remove([filePath])

      if (storageError) throw storageError

      const { error: dbError } = await supabase.from("project_files").delete().eq("id", fileId)

      if (dbError) throw dbError

      Notify.create({
        type: "positive",
        message: "Archivo eliminado correctamente",
        position: "top",
      })

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      Notify.create({
        type: "negative",
        message: "Error al eliminar archivo",
        position: "top",
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  const getFileUrl = (filePath) => {
    const { data } = supabase.storage.from("project-files").getPublicUrl(filePath)
    return data.publicUrl
  }

  const getFileContent = async (filePath) => {
    try {
      const { data, error } = await supabase.storage.from("project-files").download(filePath)

      if (error) throw error

      const text = await data.text()
      return text
    } catch (error) {
      console.error("Error getting file content:", error)
      throw error
    }
  }

  return {
    loading,
    uploadProgress,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    getFileUrl,
    getFileContent,
  }
})


function getMimeType(extension) {
  const mimeTypes = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    txt: "text/plain",
  }
  return mimeTypes[extension] || "application/octet-stream"
}
