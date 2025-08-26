import React, { useEffect } from 'react';
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
  const { posts, loading } = state;

  // Find the current post
  const post = posts.find(p => p.slug === slug);

  // Get related posts
  const relatedPosts = posts
    .filter(p => p.published && p.id !== post?.id && p.category_id === post?.category_id)
    .slice(0, 3);

  // Set font dynamically (runs only once)
  useEffect(() => {
    const poppinsLink = document.createElement('link');
    poppinsLink.href =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
    poppinsLink.rel = 'stylesheet';
    if (!document.querySelector(`link[href="${poppinsLink.href}"]`)) {
      document.head.appendChild(poppinsLink);
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading article...
      </div>
    );
  }

  // If post not found
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Article Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium max-w-2xl mx-auto">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Back to Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Sharing info
  const shareUrl = window.location.href;
  const shareTitle = post.title;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Article */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors font-medium group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          {/* Meta Information */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
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
              <span className="flex items-center">
                <User size={14} className="mr-1" />
                Admin
              </span>
            </div>

            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {post.title}
            </motion.h1>

            {post.excerpt && (
              <motion.div
                className="text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </motion.div>
          )}

          {/* Share Section */}
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Share this article:</span>
            <div className="flex space-x-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <button
                onClick={() => navigator.share?.({ title: shareTitle, url: shareUrl })}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Article Content */}
          {post.content && (
            <motion.div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-semibold prose-a:hover:text-blue-800 prose-strong:text-gray-900 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:text-gray-600 prose-blockquote:italic prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-li:text-gray-700 prose-img:rounded-xl prose-img:shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Tags Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
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
          className="py-16 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
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
