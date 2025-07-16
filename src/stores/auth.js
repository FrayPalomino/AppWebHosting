import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../boot/supabase";
import { Notify } from "quasar";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);
  const initialized = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  const initializeAuth = async () => {
    try {
      loading.value = true;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      user.value = session?.user ?? null;

      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user ?? null;

        if (event === "SIGNED_OUT") {
          Notify.create({
            type: "info",
            message: "Sesión cerrada",
            position: "top",
          });
        }
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      Notify.create({
        type: "negative",
        message: "Error al inicializar autenticación",
        position: "top",
      });
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  };

  const signUp = async (email, password) => {
    try {
      loading.value = true;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/#/dashboard`,
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email,
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      Notify.create({
        type: "positive",
        message: "Cuenta creada exitosamente. Revisa tu email para confirmar.",
        position: "top",
        timeout: 5000,
      });

      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      Notify.create({
        type: "negative",
        message: error.message || "Error al crear cuenta",
        position: "top",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const signIn = async (email, password) => {
    try {
      loading.value = true;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Notificación SOLO aquí, tras un login exitoso
      Notify.create({
        type: "positive",
        message: "Sesión iniciada correctamente",
        position: "top",
      });

      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      Notify.create({
        type: "negative",
        message: error.message || "Error al iniciar sesión",
        position: "top",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const signInWithMagicLink = async (email) => {
    try {
      loading.value = true;

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/#/dashboard`,
        },
      });

      if (error) throw error;

      Notify.create({
        type: "positive",
        message: "¡Revisa tu email para el enlace de acceso!",
        position: "top",
        timeout: 5000,
      });

      return data;
    } catch (error) {
      console.error("Error sending magic link:", error);
      Notify.create({
        type: "negative",
        message: error.message || "Error al enviar enlace mágico",
        position: "top",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    try {
      loading.value = true;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
    } catch (error) {
      console.error("Error signing out:", error);
      Notify.create({
        type: "negative",
        message: "Error al cerrar sesión",
        position: "top",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (updates) => {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      Notify.create({
        type: "positive",
        message: "Perfil actualizado correctamente",
        position: "top",
      });

      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      Notify.create({
        type: "negative",
        message: "Error al actualizar perfil",
        position: "top",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    initializeAuth,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    updateProfile,
  };
});
