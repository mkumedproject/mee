import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Update types to match medical platform
export type Category = Database['public']['Tables']['tags']['Row'];
export type Post = Database['public']['Tables']['notes']['Row'] & {
  category?: Category;
  unit?: any;
  year?: any;
  lecturer?: any;
};

interface BlogState {
  posts: Post[];
  categories: Category[];
  loading: boolean;
  currentUser: any;
  error: string | null;
}

type BlogAction = 
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: BlogState = {
  posts: [],
  categories: [],
  loading: false,
  currentUser: null,
  error: null,
};

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const BlogContext = createContext<{
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
  fetchPosts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createPost: (post: any) => Promise<void>;
  updatePost: (id: string, post: any) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  createCategory: (category: any) => Promise<void>;
  updateCategory: (id: string, category: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  fetchPosts: async () => {},
  fetchCategories: async () => {},
  createPost: async () => {},
  updatePost: async () => {},
  deletePost: async () => {},
  createCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
});

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Fetch notes (posts) with relationships
  const fetchPosts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: notes, error } = await supabase
        .from('notes')
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*),
          tags:note_tags(tag:tags(*))
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to flatten tags
      const transformedNotes = notes?.map(note => ({
        ...note,
        published: note.is_published,
        category: note.tags?.[0]?.tag || null,
        tags: note.tags?.map((nt: any) => nt.tag) || []
      })) || [];

      dispatch({ type: 'SET_POSTS', payload: transformedNotes });
    } catch (error) {
      console.error('Error fetching notes:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notes' });
    }
  };

  // Fetch tags (categories)
  const fetchCategories = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: tags, error } = await supabase
        .from('tags')
        .select('*')
        .order('tag_name');

      if (error) throw error;
      
      // Transform tags to match category structure
      const transformedTags = tags?.map(tag => ({
        ...tag,
        name: tag.tag_name,
        slug: tag.tag_name.toLowerCase().replace(/\s+/g, '-')
      })) || [];

      dispatch({ type: 'SET_CATEGORIES', payload: transformedTags });
    } catch (error) {
      console.error('Error fetching tags:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
    }
  };

  // Create note (post)
  const createPost = async (postData: any) => {
    try {
      const noteData = {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        unit_id: postData.unit_id,
        year_id: postData.year_id,
        lecturer_id: postData.lecturer_id,
        featured_image: postData.featured_image,
        is_published: postData.published || false,
        is_featured: false,
        difficulty_level: 'Intermediate',
        estimated_read_time: Math.ceil(postData.content.split(' ').length / 200)
      };

      const { data: note, error } = await supabase
        .from('notes')
        .insert(noteData)
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      if (error) throw error;
      
      const transformedNote = {
        ...note,
        published: note.is_published
      };
      
      dispatch({ type: 'ADD_POST', payload: transformedNote });
    } catch (error) {
      console.error('Error creating note:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create note' });
      throw error;
    }
  };

  // Update note (post)
  const updatePost = async (id: string, postData: any) => {
    try {
      const noteData = {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        featured_image: postData.featured_image,
        is_published: postData.published,
        updated_at: new Date().toISOString()
      };

      const { data: note, error } = await supabase
        .from('notes')
        .update(noteData)
        .eq('id', id)
        .select(`
          *,
          unit:units(*),
          year:years(*),
          lecturer:lecturers(*)
        `)
        .single();

      if (error) throw error;
      
      const transformedNote = {
        ...note,
        published: note.is_published
      };
      
      dispatch({ type: 'UPDATE_POST', payload: transformedNote });
    } catch (error) {
      console.error('Error updating note:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update note' });
      throw error;
    }
  };

  // Delete note (post)
  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_POST', payload: id });
    } catch (error) {
      console.error('Error deleting note:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete note' });
      throw error;
    }
  };

  // Create tag (category)
  const createCategory = async (categoryData: any) => {
    try {
      const tagData = {
        tag_name: categoryData.name,
        description: categoryData.description,
        color_code: '#6B7280'
      };

      const { data: tag, error } = await supabase
        .from('tags')
        .insert(tagData)
        .select()
        .single();

      if (error) throw error;
      
      const transformedTag = {
        ...tag,
        name: tag.tag_name,
        slug: tag.tag_name.toLowerCase().replace(/\s+/g, '-')
      };
      
      dispatch({ type: 'ADD_CATEGORY', payload: transformedTag });
    } catch (error) {
      console.error('Error creating tag:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create category' });
      throw error;
    }
  };

  // Update tag (category)
  const updateCategory = async (id: string, categoryData: any) => {
    try {
      const tagData = {
        tag_name: categoryData.name,
        description: categoryData.description
      };

      const { data: tag, error } = await supabase
        .from('tags')
        .update(tagData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedTag = {
        ...tag,
        name: tag.tag_name,
        slug: tag.tag_name.toLowerCase().replace(/\s+/g, '-')
      };
      
      dispatch({ type: 'UPDATE_CATEGORY', payload: transformedTag });
    } catch (error) {
      console.error('Error updating tag:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
      throw error;
    }
  };

  // Delete tag (category)
  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Error deleting tag:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      throw error;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Initial data fetch
    fetchPosts();
    fetchCategories();

    // Set up real-time subscription for notes
    const notesSubscription = supabase
      .channel('notes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Notes change received:', payload);
          fetchPosts(); // Refetch notes to get updated data with relationships
        }
      )
      .subscribe();

    // Set up real-time subscription for tags
    const tagsSubscription = supabase
      .channel('tags_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tags' },
        (payload) => {
          console.log('Tags change received:', payload);
          fetchCategories(); // Refetch tags
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(notesSubscription);
      supabase.removeChannel(tagsSubscription);
    };
  }, []);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        dispatch({ type: 'SET_USER', payload: session.user });
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        dispatch({ type: 'SET_USER', payload: session.user });
      } else {
        dispatch({ type: 'SET_USER', payload: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BlogContext.Provider value={{ 
      state, 
      dispatch, 
      fetchPosts,
      fetchCategories,
      createPost,
      updatePost,
      deletePost,
      createCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};