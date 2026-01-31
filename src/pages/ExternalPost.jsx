import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../components";
import parse from "html-react-parser";

const ExternalPost = () => {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug || !slug.startsWith("medium-")) {
      navigate("/");
      return;
    }

    const realId = slug.replace("medium-", "");

    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/topic/technology",
    )
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || [];
        const article = items.find((item) => {
          const itemId = item.guid ? item.guid.split("/").pop() : "";
          return itemId === realId;
        });

        if (article) {
          setPost(article);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("ExternalPost :: fetch error", err);
        navigate("/");
      });
  }, [slug, navigate]);

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <div className="w-full max-w-4xl rounded-xl overflow-hidden bg-gray-50">
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="text-sm text-gray-500 mt-2">
            By {post.author} &bull;{" "}
            {new Date(post.pubDate).toLocaleDateString()}
          </div>
        </div>
        <div className="browser-css">{parse(post.content || "")}</div>
      </Container>
    </div>
  ) : null;
};

export default ExternalPost;
