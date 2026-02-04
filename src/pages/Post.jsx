import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [bgUrl, setBgUrl] = useState(null); // new: resolved preview url
  const [imgLoading, setImgLoading] = useState(true); // new: image loading flag
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) setPost(post);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  useEffect(() => {
    let mounted = true;
    setBgUrl(null);
    setImgLoading(true);

    if (!post?.featuredImage) {
      setImgLoading(false);
      return;
    }

    (async () => {
      try {
        const url = await appwriteService.getFilePreview(post.featuredImage);
        if (!mounted) return;

        if (!url) {
          setImgLoading(false);
          return;
        }

        const img = new Image();
        img.onload = () => {
          if (mounted) {
            setBgUrl(url);
            setImgLoading(false);
          }
        };
        img.onerror = () => {
          if (mounted) {
            setBgUrl(null);
            setImgLoading(false);
          }
        };
        img.src = url;
      } catch (err) {
        console.error("Post :: getFilePreview error", err);
        if (mounted) setImgLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [post]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        if (post.featuredImage) appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          {/* Improved preview: spinner, image, placeholder */}
          <div className="w-full max-w-4xl rounded-xl overflow-hidden bg-gray-50">
            <div className="relative w-full aspect-video bg-center bg-cover flex items-center justify-center">
              {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                  <svg
                    className="animate-spin h-10 w-10 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              )}

              {bgUrl ? (
                <img
                  src={bgUrl}
                  alt={post.title || "post preview"}
                  className="w-full h-full object-cover"
                  onLoad={() => setImgLoading(false)}
                  onError={() => {
                    setImgLoading(false);
                    setBgUrl(null);
                  }}
                />
              ) : !imgLoading ? (
                // placeholder when no image available
                <div className="flex flex-col items-center justify-center gap-2 px-4 text-gray-500">
                  <svg
                    className="h-14 w-14 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      width="20"
                      height="14"
                      x="2"
                      y="5"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
                    <path
                      d="M21 19l-5-7-4 5-3-4-4 7"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm">No preview available</span>
                </div>
              ) : null}
            </div>
          </div>

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}
