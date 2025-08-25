import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Share2, Twitter, Facebook, Linkedin } from "lucide-react";

export default function PostPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4">
      <article className="w-full max-w-4xl py-10">
        {/* Breadcrumb / Back */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-2 text-gray-500 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <a href="/" className="hover:text-gray-900 transition-colors">
            Back to Home
          </a>
        </motion.div>

        {/* Title & Meta */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            The Future of Healthcare: How Technology is Transforming Medicine
          </h1>
          <p className="text-gray-500 text-lg">
            By <span className="font-medium text-gray-700">Dr. Jane Smith</span> · August 22, 2025
          </p>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-2xl shadow-sm mb-10"
        >
          <img
            src="https://source.unsplash.com/1200x600/?healthcare,technology"
            alt="Healthcare Technology"
            className="w-full object-cover"
          />
        </motion.div>

        {/* Content */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="prose prose-lg prose-gray max-w-none mb-12"
        >
          <p>
            Technology is revolutionizing healthcare, from AI-driven diagnostics to robotic-assisted
            surgeries. These innovations promise better outcomes, improved accessibility, and
            personalized patient care.
          </p>

          <h2>The Role of Artificial Intelligence</h2>
          <p>
            AI has the potential to analyze complex medical data faster and more accurately than
            humans, supporting doctors in making critical decisions.
          </p>

          <h2>Telemedicine & Remote Monitoring</h2>
          <p>
            Virtual consultations and remote patient monitoring have increased access to healthcare,
            especially in underserved areas.
          </p>

          <blockquote>
            “The integration of technology into medicine is not just a trend—it’s the future of
            saving lives.”
          </blockquote>

          <p>
            As technology continues to advance, ethical considerations, privacy concerns, and
            equitable access will remain vital topics of discussion.
          </p>
        </motion.section>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <p className="text-gray-700 font-medium">Share this article:</p>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="hover:bg-gray-100">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-gray-100">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-gray-100">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-gray-100">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
