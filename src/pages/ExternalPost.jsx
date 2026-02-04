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
    <div className="py-12 bg-gradient-to-b from-indigo-50 via-white to-white min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {post.thumbnail && (
            <div className="relative w-full h-64 sm:h-96">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                aria-hidden
              />
            </div>
          )}

          <div className="px-6 py-6 sm:px-10 sm:py-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-tight">
              {post.title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
                {post.author}
              </span>

              <span className="text-sm text-gray-500">
                {new Date(post.pubDate).toLocaleDateString()}
              </span>

              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center text-sm font-medium text-indigo-600 hover:underline"
              >
                View on Medium
              </a>
            </div>

            <div className="mt-6 border-t pt-6 browser-css text-gray-800 dark:text-gray-200">
              {parse(post.content || "")}
            </div>
          </div>
        </div>
      </Container>
    </div>
  ) : null;
};

export default ExternalPost;
