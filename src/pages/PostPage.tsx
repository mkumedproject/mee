import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { useBlog } from '../context/BlogContext';
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useBlog();
  const { posts } = state;

  const post = posts.find(p => p.slug === slug);
  const relatedPosts = posts
    .filter(p => p.published && p.id !== post?.id && p.category_id === post?.category_id)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">Article Not Found</h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center bg-slate-900 text-white px-8 py-4 rounded-lg hover:bg-slate-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Back to Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white py-6 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-3 text-base">
            <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Home</Link>
            <span className="text-slate-400">/</span>
            <Link to="/blog" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Blog</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-800 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Article */}
      <article className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-12 transition-colors font-medium text-lg group"
          >
            <ArrowLeft size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          {/* Meta Information */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-6 text-base text-slate-600 mb-8">
              {post.category && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                  <Tag size={14} className="mr-2" />
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center font-medium">
                <Calendar size={18} className="mr-3 text-slate-400" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center font-medium">
                <User size={18} className="mr-3 text-slate-400" />
                Admin
              </span>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {post.title}
            </motion.h1>

            {post.excerpt && (
              <motion.div
                className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light max-w-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <motion.div 
              className="mb-16" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-72 md:h-[32rem] object-cover rounded-2xl shadow-2xl" 
              />
            </motion.div>
          )}

          {/* Share Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-16 pb-12 border-b border-slate-200">
            <span className="text-slate-700 font-semibold text-lg">Share this article:</span>
            <div className="flex space-x-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Twitter size={20} />
              </a>
              <button 
                onClick={() => navigator.share?.({ title: shareTitle, url: shareUrl })}
                className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Article Content */}
          <motion.div
            className="prose prose-xl prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg prose-a:text-slate-900 prose-a:font-semibold prose-strong:text-slate-900 prose-strong:font-semibold prose-blockquote:border-slate-300 prose-blockquote:text-slate-600 prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:font-light prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-li:text-slate-700 prose-li:text-lg prose-img:rounded-xl prose-img:shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Section */}
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex flex-wrap gap-3">
              {post.category && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition-colors">
                  #{post.category.slug}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <motion.section
          className="py-20 bg-white border-t border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 tracking-tight">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div 
                  key={relatedPost.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <PostCard post={relatedPost} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <Footer />
    </div>
  );
};

export default PostPage;