import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'] & {
  category?: Category;
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
  createPost: (post: Database['public']['Tables']['posts']['Insert']) => Promise<void>;
  updatePost: (id: string, post: Database['public']['Tables']['posts']['Update']) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  createCategory: (category: Database['public']['Tables']['categories']['Insert']) => Promise<void>;
  updateCategory: (id: string, category: Database['public']['Tables']['categories']['Update']) => Promise<void>;
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

  // Fetch posts with categories
  const fetchPosts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      dispatch({ type: 'SET_POSTS', payload: posts || [] });
    } catch (error) {
      console.error('Error fetching posts:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch posts' });
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      dispatch({ type: 'SET_CATEGORIES', payload: categories || [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
    }
  };

  // Create post
  const createPost = async (postData: Database['public']['Tables']['posts']['Insert']) => {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .insert(postData)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_POST', payload: post });
    } catch (error) {
      console.error('Error creating post:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create post' });
      throw error;
    }
  };

  // Update post
  const updatePost = async (id: string, postData: Database['public']['Tables']['posts']['Update']) => {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select(`
          *,
          category:categories(*)
        `)
        .single();

      if (error) throw error;
      dispatch({ type: 'UPDATE_POST', payload: post });
    } catch (error) {
      console.error('Error updating post:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update post' });
      throw error;
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_POST', payload: id });
    } catch (error) {
      console.error('Error deleting post:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete post' });
      throw error;
    }
  };

  // Create category
  const createCategory = async (categoryData: Database['public']['Tables']['categories']['Insert']) => {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'ADD_CATEGORY', payload: category });
    } catch (error) {
      console.error('Error creating category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create category' });
      throw error;
    }
  };

  // Update category
  const updateCategory = async (id: string, categoryData: Database['public']['Tables']['categories']['Update']) => {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    } catch (error) {
      console.error('Error updating category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
      throw error;
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Error deleting category:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      throw error;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Initial data fetch
    fetchPosts();
    fetchCategories();

    // Set up real-time subscription for posts
    const postsSubscription = supabase
      .channel('posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('Posts change received:', payload);
          fetchPosts(); // Refetch posts to get updated data with categories
        }
      )
      .subscribe();

    // Set up real-time subscription for categories
    const categoriesSubscription = supabase
      .channel('categories_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Categories change received:', payload);
          fetchCategories(); // Refetch categories
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(postsSubscription);
      supabase.removeChannel(categoriesSubscription);
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