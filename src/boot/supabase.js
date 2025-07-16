import { boot } from "quasar/wrappers"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || "https://swfuqcmdsmtpuacaqsww.supabase.co"
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3ZnVxY21kc210cHVhY2Fxc3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDE4MTcsImV4cCI6MjA2ODA3NzgxN30.Z8TEmBaPKHQFiwj3S3dyZIfv2Jb2lqAttpSITeq7YKE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default boot(({ app }) => {
  app.config.globalProperties.$supabase = supabase
  app.provide("supabase", supabase)
})
