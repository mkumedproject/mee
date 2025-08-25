/*
  # Create blog schema with categories and posts

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `featured_image` (text, nullable)
      - `category_id` (uuid, foreign key)
      - `published` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image text,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for posts
CREATE POLICY "Published posts are viewable by everyone"
  ON posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "All posts are viewable by authenticated users"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_category_id_idx ON posts(category_id);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Education News', 'education-news', 'Latest updates in education sector'),
  ('Teacher Resources', 'teacher-resources', 'Resources and tools for teachers'),
  ('Exam Information', 'exam-information', 'Exam schedules and updates'),
  ('Policy Updates', 'policy-updates', 'Education policy changes and updates')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample posts
DO $$
DECLARE
  education_news_id uuid;
  teacher_resources_id uuid;
  exam_info_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO education_news_id FROM categories WHERE slug = 'education-news';
  SELECT id INTO teacher_resources_id FROM categories WHERE slug = 'teacher-resources';
  SELECT id INTO exam_info_id FROM categories WHERE slug = 'exam-information';

  -- Insert sample posts
  INSERT INTO posts (title, slug, excerpt, content, featured_image, category_id, published, created_at, updated_at) VALUES
    (
      'TSC Distribution of 30,550 JSS Teaching Jobs',
      'tsc-distribution-30550-jss-teaching-jobs',
      'Teachers Service Commission announces the distribution of thousands of teaching positions across the country.',
      'The Teachers Service Commission has announced a major recruitment drive with the distribution of 30,550 Junior Secondary School teaching positions. This announcement comes as part of the government''s commitment to improving education quality and addressing teacher shortages across the country.

The positions are distributed across various subjects including Mathematics, English, Science, Social Studies, and Technical subjects. Teachers who meet the qualification requirements are encouraged to apply through the official TSC portal.

Key requirements include:
- Bachelor''s degree in Education or relevant field
- Valid teaching certificate
- Computer literacy skills
- Clean certificate of good conduct

The application process will be conducted online, and successful candidates will be posted to schools based on need and merit.',
      'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=800',
      education_news_id,
      true,
      now() - interval '1 day',
      now() - interval '1 day'
    ),
    (
      'Crisis as Moi University Suspends Learning, Sends Home All Students',
      'moi-university-suspends-learning-sends-home-students',
      'Moi University has been forced to suspend all learning activities and send students home following ongoing challenges.',
      'Moi University, one of Kenya''s premier institutions of higher learning, has made the difficult decision to suspend all academic activities and send students home. The decision comes after weeks of mounting challenges that have made it impossible to continue normal operations.

The university administration cited several factors leading to this decision:
- Financial constraints affecting daily operations
- Staff industrial action over unpaid salaries
- Deteriorating infrastructure requiring urgent repairs
- Safety concerns for students and staff

Vice-Chancellor Professor Isaac Kosgey announced that the university will work around the clock to resolve these issues and ensure that students can return to complete their academic programs. The administration is in discussions with relevant stakeholders to find sustainable solutions.

Students have been advised to check the university website regularly for updates on when learning will resume.',
      'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800',
      education_news_id,
      true,
      now() - interval '2 days',
      now() - interval '2 days'
    ),
    (
      'JSS to Receive Huge Capitation in January as State Puts Sh 110B for Education',
      'jss-huge-capitation-january-state-110b-education',
      'The government allocates massive funds for Junior Secondary School capitation to improve learning conditions.',
      'The government has announced a substantial increase in capitation for Junior Secondary Schools, with Sh 110 billion allocated for the education sector in the upcoming financial year. This represents a significant commitment to improving the quality of education at the junior secondary level.

The increased capitation will address several critical areas:
- Infrastructure development and maintenance
- Learning materials and textbooks
- Laboratory equipment and supplies
- Teacher training and professional development
- Digital learning resources

Education Cabinet Secretary noted that this investment is part of the government''s long-term strategy to ensure that the Competency-Based Curriculum is successfully implemented across all schools.

School principals and education officials have welcomed this announcement, noting that adequate funding has been a major challenge in implementing the new curriculum effectively.',
      'https://images.pexels.com/photos/5212344/pexels-photo-5212344.jpeg?auto=compress&cs=tinysrgb&w=800',
      education_news_id,
      true,
      now() - interval '3 days',
      now() - interval '3 days'
    )
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for posts table
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();