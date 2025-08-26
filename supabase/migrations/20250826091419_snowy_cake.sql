/*
  # Medfly Medical Notes Platform Schema

  1. New Tables
    - `years` - Academic years (1-6) for medical program
    - `lecturers` - Faculty information and specializations  
    - `units` - Academic subjects/units per year
    - `notes` - Core notes content with rich metadata
    - `tags` - Hierarchical tagging system
    - `note_tags` - Many-to-many relationship for note tagging
    - `user_bookmarks` - Student bookmarking system
    - `note_views` - Analytics tracking for popular content

  2. Security
    - Enable RLS on all tables
    - Add policies for public reading and authenticated admin access
    - Secure file upload and content management

  3. Indexes
    - Full-text search indexes for efficient searching
    - Composite indexes for common query patterns
    - Performance optimization for mobile users
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS note_tags CASCADE;
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS note_views CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;
DROP TABLE IF EXISTS years CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Academic Years Table (1-6 for medical program)
CREATE TABLE IF NOT EXISTS years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_number integer NOT NULL UNIQUE CHECK (year_number >= 1 AND year_number <= 6),
  year_name text NOT NULL,
  description text DEFAULT '',
  color_code text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- Lecturers Table
CREATE TABLE IF NOT EXISTS lecturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text DEFAULT 'Dr.',
  specialization text NOT NULL,
  email text,
  phone text,
  office_location text,
  bio text DEFAULT '',
  profile_image text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Units/Subjects Table
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_name text NOT NULL,
  unit_code text NOT NULL UNIQUE,
  year_id uuid REFERENCES years(id) ON DELETE CASCADE,
  lecturer_id uuid REFERENCES lecturers(id) ON DELETE SET NULL,
  description text DEFAULT '',
  credit_hours integer DEFAULT 3,
  semester text CHECK (semester IN ('1', '2', 'Both')) DEFAULT '1',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tags Table for categorization
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name text NOT NULL UNIQUE,
  description text DEFAULT '',
  color_code text DEFAULT '#6B7280',
  parent_tag_id uuid REFERENCES tags(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Notes Table (main content)
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text NOT NULL,
  unit_id uuid REFERENCES units(id) ON DELETE CASCADE,
  year_id uuid REFERENCES years(id) ON DELETE CASCADE,
  lecturer_id uuid REFERENCES lecturers(id) ON DELETE SET NULL,
  featured_image text,
  file_attachments jsonb DEFAULT '[]',
  difficulty_level text CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
  estimated_read_time integer DEFAULT 5,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Note Tags Junction Table
CREATE TABLE IF NOT EXISTS note_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(note_id, tag_id)
);

-- User Bookmarks Table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, note_id)
);

-- Note Views Analytics Table
CREATE TABLE IF NOT EXISTS note_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  user_id uuid,
  ip_address inet,
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_units_year_id ON units(year_id);
CREATE INDEX IF NOT EXISTS idx_units_lecturer_id ON units(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_notes_unit_id ON notes(unit_id);
CREATE INDEX IF NOT EXISTS idx_notes_year_id ON notes(year_id);
CREATE INDEX IF NOT EXISTS idx_notes_lecturer_id ON notes(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_notes_published ON notes(is_published);
CREATE INDEX IF NOT EXISTS idx_notes_featured ON notes(is_featured);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag_id ON note_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_note_views_note_id ON note_views(note_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING gin(to_tsvector('english', title || ' ' || content || ' ' || excerpt));
CREATE INDEX IF NOT EXISTS idx_units_search ON units USING gin(to_tsvector('english', unit_name || ' ' || unit_code || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_lecturers_search ON lecturers USING gin(to_tsvector('english', name || ' ' || specialization));

-- Enable Row Level Security
ALTER TABLE years ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public reading
CREATE POLICY "Years are viewable by everyone" ON years FOR SELECT TO public USING (true);
CREATE POLICY "Lecturers are viewable by everyone" ON lecturers FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Units are viewable by everyone" ON units FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT TO public USING (true);
CREATE POLICY "Published notes are viewable by everyone" ON notes FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Note tags are viewable by everyone" ON note_tags FOR SELECT TO public USING (true);
CREATE POLICY "Note views are insertable by everyone" ON note_views FOR INSERT TO public WITH CHECK (true);

-- RLS Policies for authenticated admin users
CREATE POLICY "Authenticated users can manage years" ON years FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage lecturers" ON lecturers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage units" ON units FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage tags" ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage notes" ON notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage note tags" ON note_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage their bookmarks" ON user_bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_lecturers_updated_at BEFORE UPDATE ON lecturers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for medical program
INSERT INTO years (year_number, year_name, description, color_code) VALUES
(1, 'Year 1 - Foundation', 'Basic medical sciences and foundation courses', '#EF4444'),
(2, 'Year 2 - Pre-Clinical', 'Advanced basic sciences and introduction to clinical concepts', '#F97316'),
(3, 'Year 3 - Clinical Introduction', 'Introduction to clinical medicine and patient care', '#EAB308'),
(4, 'Year 4 - Clinical Rotations', 'Core clinical rotations in major specialties', '#22C55E'),
(5, 'Year 5 - Advanced Clinical', 'Advanced clinical training and subspecialties', '#3B82F6'),
(6, 'Year 6 - Internship', 'Clinical internship and preparation for practice', '#8B5CF6');

-- Insert sample lecturers
INSERT INTO lecturers (name, title, specialization, email, bio) VALUES
('Dr. Sarah Wanjiku', 'Prof.', 'Anatomy & Physiology', 'swanjiku@mku.ac.ke', 'Professor of Anatomy with 15 years of teaching experience'),
('Dr. James Mwangi', 'Dr.', 'Biochemistry', 'jmwangi@mku.ac.ke', 'Senior lecturer specializing in medical biochemistry'),
('Dr. Grace Akinyi', 'Prof.', 'Pathology', 'gakinyi@mku.ac.ke', 'Head of Pathology Department'),
('Dr. Peter Kiprotich', 'Dr.', 'Pharmacology', 'pkiprotich@mku.ac.ke', 'Clinical pharmacologist and researcher'),
('Dr. Mary Njeri', 'Prof.', 'Internal Medicine', 'mnjeri@mku.ac.ke', 'Consultant physician and medical educator'),
('Dr. David Ochieng', 'Dr.', 'Surgery', 'dochieng@mku.ac.ke', 'Consultant surgeon and clinical skills coordinator');

-- Insert sample units for each year
INSERT INTO units (unit_name, unit_code, year_id, lecturer_id, description, semester) VALUES
-- Year 1 Units
('Human Anatomy I', 'ANAT 101', (SELECT id FROM years WHERE year_number = 1), (SELECT id FROM lecturers WHERE name = 'Dr. Sarah Wanjiku'), 'Basic human anatomy covering musculoskeletal and cardiovascular systems', '1'),
('Human Physiology I', 'PHYS 101', (SELECT id FROM years WHERE year_number = 1), (SELECT id FROM lecturers WHERE name = 'Dr. Sarah Wanjiku'), 'Fundamental physiological processes and homeostasis', '1'),
('Medical Biochemistry I', 'BIOC 101', (SELECT id FROM years WHERE year_number = 1), (SELECT id FROM lecturers WHERE name = 'Dr. James Mwangi'), 'Basic biochemistry and molecular biology', '2'),
('Medical Ethics', 'METH 101', (SELECT id FROM years WHERE year_number = 1), (SELECT id FROM lecturers WHERE name = 'Dr. Mary Njeri'), 'Introduction to medical ethics and professionalism', '2'),

-- Year 2 Units  
('Human Anatomy II', 'ANAT 201', (SELECT id FROM years WHERE year_number = 2), (SELECT id FROM lecturers WHERE name = 'Dr. Sarah Wanjiku'), 'Advanced anatomy including nervous system and special senses', '1'),
('Human Physiology II', 'PHYS 201', (SELECT id FROM years WHERE year_number = 2), (SELECT id FROM lecturers WHERE name = 'Dr. Sarah Wanjiku'), 'Advanced physiological systems', '1'),
('Pathology I', 'PATH 201', (SELECT id FROM years WHERE year_number = 2), (SELECT id FROM lecturers WHERE name = 'Dr. Grace Akinyi'), 'General pathology and disease processes', '2'),
('Pharmacology I', 'PHAR 201', (SELECT id FROM years WHERE year_number = 2), (SELECT id FROM lecturers WHERE name = 'Dr. Peter Kiprotich'), 'Basic pharmacological principles', '2'),

-- Year 3 Units
('Clinical Medicine I', 'CMED 301', (SELECT id FROM years WHERE year_number = 3), (SELECT id FROM lecturers WHERE name = 'Dr. Mary Njeri'), 'Introduction to clinical medicine and patient assessment', '1'),
('Surgery I', 'SURG 301', (SELECT id FROM years WHERE year_number = 3), (SELECT id FROM lecturers WHERE name = 'Dr. David Ochieng'), 'Basic surgical principles and procedures', '1'),
('Pathology II', 'PATH 301', (SELECT id FROM years WHERE year_number = 3), (SELECT id FROM lecturers WHERE name = 'Dr. Grace Akinyi'), 'Systemic pathology', '2'),
('Pharmacology II', 'PHAR 301', (SELECT id FROM years WHERE year_number = 3), (SELECT id FROM lecturers WHERE name = 'Dr. Peter Kiprotich'), 'Clinical pharmacology and therapeutics', '2');

-- Insert sample tags
INSERT INTO tags (tag_name, description, color_code) VALUES
('Anatomy', 'Human anatomy and structure', '#EF4444'),
('Physiology', 'Body functions and processes', '#F97316'),
('Biochemistry', 'Chemical processes in living organisms', '#EAB308'),
('Pathology', 'Study of disease', '#22C55E'),
('Pharmacology', 'Drug action and therapy', '#3B82F6'),
('Clinical Skills', 'Practical clinical procedures', '#8B5CF6'),
('Exam Prep', 'Examination preparation materials', '#EC4899'),
('Case Studies', 'Clinical case discussions', '#10B981'),
('Research', 'Medical research and evidence', '#6366F1'),
('Emergency Medicine', 'Emergency care procedures', '#DC2626');

-- Insert sample notes
INSERT INTO notes (title, slug, content, excerpt, unit_id, year_id, lecturer_id, difficulty_level, is_published, is_featured) VALUES
('Introduction to Human Anatomy', 'introduction-human-anatomy', 
'<h2>Overview of Human Anatomy</h2><p>Human anatomy is the scientific study of the structure of the human body. It is a fundamental subject in medical education that provides the foundation for understanding how the body works.</p><h3>Key Systems</h3><ul><li>Musculoskeletal System</li><li>Cardiovascular System</li><li>Nervous System</li><li>Respiratory System</li></ul><p>Understanding anatomical terminology and body planes is essential for effective communication in healthcare.</p>', 
'Comprehensive introduction to human anatomy covering basic systems and terminology essential for medical students.',
(SELECT id FROM units WHERE unit_code = 'ANAT 101'),
(SELECT id FROM years WHERE year_number = 1),
(SELECT id FROM lecturers WHERE name = 'Dr. Sarah Wanjiku'),
'Beginner', true, true),

('Cardiovascular Physiology', 'cardiovascular-physiology',
'<h2>The Heart and Circulation</h2><p>The cardiovascular system is responsible for transporting blood, nutrients, and oxygen throughout the body. This complex system includes the heart, blood vessels, and blood.</p><h3>Heart Structure</h3><p>The heart has four chambers: two atria and two ventricles. Each chamber has specific functions in the cardiac cycle.</p><h3>Cardiac Cycle</h3><ol><li>Systole - Contraction phase</li><li>Diastole - Relaxation phase</li></ol><p>Understanding these concepts is crucial for clinical practice.</p>',
'Detailed study of cardiovascular physiology including heart structure, function, and the cardiac cycle.',
(SELECT id FROM units WHERE unit_code = 'PHYS 101'),
(SELECT id FROM years WHERE year_number = 1),
(SELECT id FROM lecturers WHERE name = 'Dr. Sarah Wanjiku'),
'Intermediate', true, true),

('Basic Biochemistry Principles', 'basic-biochemistry-principles',
'<h2>Fundamentals of Medical Biochemistry</h2><p>Biochemistry is the study of chemical processes within living organisms. It bridges biology and chemistry to explain life processes at the molecular level.</p><h3>Key Concepts</h3><ul><li>Proteins and Enzymes</li><li>Carbohydrate Metabolism</li><li>Lipid Metabolism</li><li>Nucleic Acids</li></ul><p>These concepts form the foundation for understanding disease processes and drug actions.</p>',
'Essential biochemistry concepts including proteins, metabolism, and molecular processes in human health.',
(SELECT id FROM units WHERE unit_code = 'BIOC 101'),
(SELECT id FROM years WHERE year_number = 1),
(SELECT id FROM lecturers WHERE name = 'Dr. James Mwangi'),
'Intermediate', true, false),

('General Pathology Overview', 'general-pathology-overview',
'<h2>Introduction to Disease Processes</h2><p>Pathology is the study of disease, including its causes, development, and effects on the body. Understanding pathological processes is essential for diagnosis and treatment.</p><h3>Types of Disease</h3><ul><li>Inflammatory Diseases</li><li>Neoplastic Diseases</li><li>Degenerative Diseases</li><li>Infectious Diseases</li></ul><p>Each type has characteristic features and mechanisms.</p>',
'Comprehensive overview of general pathology covering disease classification and basic pathological processes.',
(SELECT id FROM units WHERE unit_code = 'PATH 201'),
(SELECT id FROM years WHERE year_number = 2),
(SELECT id FROM lecturers WHERE name = 'Dr. Grace Akinyi'),
'Advanced', true, false);

-- Link notes with tags
INSERT INTO note_tags (note_id, tag_id) VALUES
((SELECT id FROM notes WHERE slug = 'introduction-human-anatomy'), (SELECT id FROM tags WHERE tag_name = 'Anatomy')),
((SELECT id FROM notes WHERE slug = 'cardiovascular-physiology'), (SELECT id FROM tags WHERE tag_name = 'Physiology')),
((SELECT id FROM notes WHERE slug = 'cardiovascular-physiology'), (SELECT id FROM tags WHERE tag_name = 'Anatomy')),
((SELECT id FROM notes WHERE slug = 'basic-biochemistry-principles'), (SELECT id FROM tags WHERE tag_name = 'Biochemistry')),
((SELECT id FROM notes WHERE slug = 'general-pathology-overview'), (SELECT id FROM tags WHERE tag_name = 'Pathology'));