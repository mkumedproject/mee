import React from "react";
import { useParams, Link } from "react-router-dom";
import posts from "../data/posts";
import { motion } from "framer-motion";

const PostPage: React.FC = () => {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  const relatedPosts = posts
    .filter(
      (p) =>
        p.published && p.id !== post?.id && p.category_id === post?.category_id
    )
    .slice(0, 3);

  if (!post) {
    return <p className="text-center mt-10">Post not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {post.title}
      </motion.h1>

      {/* Excerpt */}
      {post.excerpt && (
        <motion.p
          className="text-lg text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
      )}

      {/* Content */}
      <motion.div
        className="prose prose-lg max-w-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Related Posts</h2>
          <div className="grid gap-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                to={`/post/${related.slug}`}
                className="block p-4 rounded-lg border hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold">{related.title}</h3>
                <p className="text-gray-600">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PostPage;
