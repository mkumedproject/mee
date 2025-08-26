/*
  # Create increment_note_view_count RPC function

  1. New Functions
    - `increment_note_view_count(note_id)` - Increments view count for a note
  
  2. Security
    - Function is accessible to public users
    - Only increments count for published notes
    - Uses SECURITY DEFINER for controlled access
*/

-- Create the increment_note_view_count function
CREATE OR REPLACE FUNCTION increment_note_view_count(note_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the view count for the note (only if published)
  UPDATE notes 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = note_id_param AND is_published = true;
END;
$$;

-- Grant execute permission to public (anonymous users)
GRANT EXECUTE ON FUNCTION increment_note_view_count(uuid) TO public;
GRANT EXECUTE ON FUNCTION increment_note_view_count(uuid) TO authenticated;