
-- Migration: 20251028234826
-- Create documents table to store document metadata
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Users can view their own documents"
  ON public.documents
  FOR SELECT
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can create their own documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own documents"
  ON public.documents
  FOR UPDATE
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete their own documents"
  ON public.documents
  FOR DELETE
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
