import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { useBlog } from '../context/BlogContext';
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

// Add Poppins font import
const poppinsLink = document.createElement('link');
poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
poppinsLink.rel = 'stylesheet';
if (!document.querySelector(`link[href="${poppinsLink.href}"]`)) {
  document.head.appendChild(poppinsLink);
}

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
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <Header />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight">Article Not Found</h1>
          <p className="text-2xl text-gray-600 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center bg-blue-600 text-white px-12 py-5 rounded-2xl hover:bg-blue-700 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
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
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white py-8 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <nav className="flex items-center space-x-4 text-lg">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">Home</Link>
            <span className="text-gray-400 font-medium">/</span>
            <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">Blog</Link>
            <span className="text-gray-400 font-medium">/</span>
            <span className="text-gray-600 font-bold truncate">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Article */}
      <article className="py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-16 transition-all duration-300 font-semibold text-xl group"
          >
            <ArrowLeft size={24} className="mr-4 group-hover:-translate-x-2 transition-transform duration-300" />
            Back to Articles
          </Link>

          {/* Meta Information */}
          <div className="mb-16">
            <div className="flex flex-wrap items-center gap-8 text-lg text-gray-600 mb-12">
              {post.category && (
                <span className="inline-flex items-center px-6 py-3 rounded-full text-base font-bold bg-blue-100 text-blue-800 border-2 border-blue-200 shadow-lg">
                  <Tag size={18} className="mr-3" />
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center font-semibold text-xl">
                <Calendar size={22} className="mr-4 text-gray-400" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center font-semibold text-xl">
                <User size={22} className="mr-4 text-gray-400" />
                Admin
              </span>
            </div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[0.95] mb-12 tracking-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {post.title}
            </motion.h1>

            {post.excerpt && (
              <motion.div
                className="text-2xl md:text-3xl text-gray-600 leading-relaxed font-medium max-w-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <motion.div 
              className="mb-20" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1 }}
            >
              <img 
                src={post.featured_image} 
                alt={post.title} 
                className="w-full h-80 md:h-[36rem] lg:h-[42rem] object-cover rounded-3xl shadow-2xl border border-gray-200" 
              />
            </motion.div>
          )}

          {/* Share Section */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 mb-20 pb-16 border-b-2 border-gray-200">
            <span className="text-gray-600 font-bold text-2xl">Share this article:</span>
            <div className="flex space-x-6">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
              >
                <Facebook size={24} />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-sky-400 text-white rounded-2xl hover:bg-sky-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
              >
                <Twitter size={24} />
              </a>
              <button 
                onClick={() => navigator.share?.({ title: shareTitle, url: shareUrl })}
                className="p-5 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>

          {/* Article Content */}
          <motion.div
            className="prose prose-2xl prose-gray max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-xl prose-p:font-medium prose-a:text-blue-600 prose-a:font-bold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-8 prose-blockquote:text-gray-600 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-medium prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-3 prose-code:py-2 prose-code:rounded-lg prose-code:font-semibold prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl prose-li:text-gray-700 prose-li:text-xl prose-li:font-medium prose-img:rounded-2xl prose-img:shadow-xl prose-ul:space-y-2 prose-ol:space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Section */}
          <div className="mt-20 pt-16 border-t-2 border-gray-200">
            <div className="flex flex-wrap gap-4">
              {post.category && (
                <span className="inline-flex items-center px-6 py-3 rounded-full text-lg font-bold bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300 shadow-lg">
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
          className="py-24 bg-white border-t-2 border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-16 tracking-tight">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div 
                  key={relatedPost.id} 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.3, duration: 0.8 }}
                  className="transform hover:-translate-y-2 transition-all duration-300"
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