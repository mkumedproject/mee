"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function PostManager() {
  const [posts, setPosts] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const supabase = createClient()

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*")
      if (!error && data) setPosts(data)
    }
    fetchPosts()
  }, [supabase])

  // Add a new post
  const addPost = async () => {
    if (!title.trim()) return
    const { data, error } = await supabase.from("posts").insert([{ title }]).select()
    if (!error && data) {
      setPosts([...posts, ...data])
      setTitle("")
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
            <Button onClick={addPost}>Add</Button>
          </div>
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <ul className="list-disc pl-6">
              {posts.map((post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
