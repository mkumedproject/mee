import { useParams, Link } from "react-router-dom";
import posts from "../data/posts";
import { motion } from "framer-motion";

export default function PostPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-700">
          Post not found.
        </h1>
      </div>
    );
  }

  const relatedPosts = posts
    .filter((p) => p.published && p.id !== post.id && p.category_id === post.category_id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 lg:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Post Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 mb-6 leading-snug"
        >
          {post.title}
        </motion.h1>

        {/* Post Meta */}
        <p className="text-sm text-gray-500 mb-8">
          {post.date} ·{" "}
          <Link to={`/category/${post.category_id}`} className="text-blue-500 hover:underline">
            {post.category}
          </Link>
        </p>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="prose lg:prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <motion.div
                  key={related.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl shadow hover:shadow-lg p-5 transition"
                >
                  <Link to={`/post/${related.slug}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500">{related.date}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
