import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";

const ExternalBlog = () => {
  const [posts, setPosts] = useState([]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/topic/technology",
      );
      const data = await res.json();
      setPosts(data.items || []);
    } catch (error) {
      console.error("unable to fetch the data", error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap mb-4">
          <h1 className="text-2xl font-bold w-full pl-2">
            Latest from the Community
          </h1>
        </div>
        <div className="flex flex-wrap">
          {posts.map((post) => {
            // Extract a unique ID from the GUID (usually a URL)
            // Example guid: https://medium.com/p/e345...
            const uniqueId = post.guid
              ? post.guid.split("/").pop()
              : Math.random().toString(36).substr(2, 9);

            return (
              <div key={uniqueId} className="p-2 w-1/4">
                <PostCard
                  $id={`medium-${uniqueId}`}
                  title={post.title}
                  featuredImage={post.thumbnail}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default ExternalBlog;
