/*
  # Create increment_note_view_count RPC function

  1. New Functions
    - `increment_note_view_count(note_id_param uuid)`
      - Increments the view_count for a specific note
      - Takes a note_id parameter of type uuid
      - Updates the view_count column in the notes table
      - Also inserts a record into note_views table for tracking

  2. Security
    - Function is accessible to public users (for tracking views)
    - Uses SECURITY DEFINER to allow public access to update notes table
*/

CREATE OR REPLACE FUNCTION increment_note_view_count(note_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the view count in the notes table
  UPDATE notes 
  SET view_count = view_count + 1 
  WHERE id = note_id_param AND is_published = true;
  
  -- Insert a view record for analytics (optional user_id, required note_id)
  INSERT INTO note_views (note_id, user_id, ip_address, user_agent)
  VALUES (
    note_id_param,
    CASE WHEN auth.uid() IS NOT NULL THEN auth.uid() ELSE NULL END,
    NULL, -- IP address would need to be passed from client if needed
    NULL  -- User agent would need to be passed from client if needed
  );
END;
$$;

-- Grant execute permission to public users
GRANT EXECUTE ON FUNCTION increment_note_view_count(uuid) TO public;