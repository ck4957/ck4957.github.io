import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('blog_posts.json');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog">
        <div className="learnings-section" style={{paddingTop: '50px'}}>
            <div className="learning-heading">
            <h1 className="section-title" style={{color: 'black'}}>Blog & Learnings</h1>
            <p className="learning-intro">Captured experiments, reminders, and small static HTML outputs.</p>
            </div>
            <div className="learning-grid-wrapper">
            {posts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <article className="learning-entry blog-entry-card">
                    {post.featured && <div className="blog-featured-badge">Featured</div>}
                    <div className="learning-entry-header">
                        <h3>{post.title}</h3>
                        <span className="learning-date">{post.date}</span>
                    </div>
                    <p className="learning-summary">{post.summary}</p>
                    <div className="learning-tags">
                        {post.tags.map(tag => (
                        <span className="learning-tag" key={tag}>{tag}</span>
                        ))}
                    </div>
                    {post.readTime && <div className="blog-read-time">{post.readTime}</div>}
                  </article>
                </Link>
            ))}
            </div>
        </div>
    </section>
  );
};

export default Blog;
