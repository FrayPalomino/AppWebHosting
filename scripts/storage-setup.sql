-- Este script debe ejecutarse después del script principal
-- O puedes configurar el bucket manualmente desde la interfaz de Supabase

-- Crear bucket para archivos de proyectos (si no existe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para el bucket project-files
CREATE POLICY "Users can upload files to own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can view files in own folder" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can update files in own folder" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-files' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

CREATE POLICY "Users can delete files in own folder" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-files' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );
