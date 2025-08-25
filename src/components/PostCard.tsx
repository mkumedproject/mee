import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag } from 'lucide-react';
import { Post } from '../context/BlogContext';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (featured) {
    return (
      <article className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={post.featured_image || 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={post.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              {post.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Tag size={12} className="mr-1" />
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(post.created_at)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <Link
              to={`/post/${post.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Read More →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={post.featured_image || 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        {post.category && (
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
            <Tag size={12} className="mr-1" />
            {post.category.name}
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {formatDate(post.created_at)}
          </span>
          <span className="flex items-center">
            <User size={14} className="mr-1" />
            Admin
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <Link
          to={`/post/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;