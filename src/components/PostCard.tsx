import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Clock, ArrowRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Post } from '../context/BlogContext';

interface PostCardProps {
  post: Post;
  featured?: boolean;
  index?: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false, index = 0 }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (featured) {
    return (
      <motion.article 
        className="relative bg-white rounded-2xl shadow-xl overflow-hidden group"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
      >
        <div className="lg:flex">
          <div className="lg:w-1/2 relative overflow-hidden">
            <motion.img
              src={post.featured_image || 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={post.title}
              className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {post.category && (
              <motion.span 
                className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Tag size={12} className="mr-1" />
                {post.category.name}
              </motion.span>
            )}
          </div>
          <div className="lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatDate(post.created_at)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{estimateReadTime(post.content)} min read</span>
              </span>
              <span className="flex items-center space-x-1">
                <User size={14} />
                <span>Admin</span>
              </span>
            </div>
            <motion.h2 
              className="text-3xl font-bold font-display text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300"
              whileHover={{ x: 5 }}
            >
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </motion.h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{post.excerpt}</p>
            <motion.div whileHover={{ x: 5 }}>
              <Link
                to={`/post/${post.slug}`}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors group"
              >
                <span>Read Full Article</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article 
      className="bg-white rounded-2xl shadow-lg overflow-hidden group card-hover"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={post.featured_image || 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {post.category && (
          <motion.span 
            className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Tag size={12} className="mr-1" />
            {post.category.name}
          </motion.span>
        )}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full">
            <Eye size={16} className="text-gray-700" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{formatDate(post.created_at)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{estimateReadTime(post.content)} min</span>
          </span>
        </div>
        
        <motion.h3 
          className="text-xl font-bold font-display text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2"
          whileHover={{ x: 2 }}
        >
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </motion.h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User size={14} />
            <span>Admin</span>
          </div>
          <motion.div whileHover={{ x: 3 }}>
            <Link
              to={`/post/${post.slug}`}
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm group"
            >
              <span>Read More</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;