// PostCard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

export default function PostCard({ $id, title, featuredImage }) {
  // load preview URL asynchronously
  const [bgUrl, setBgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setBgUrl(null);

    if (!featuredImage) {
      setLoading(false);
      return;
    }

    // If it's a direct URL (e.g. from dev.to), use it directly
    if (typeof featuredImage === "string" && featuredImage.startsWith("http")) {
      const img = new Image();
      img.onload = () => {
        if (mounted) {
          setBgUrl(featuredImage);
          setLoading(false);
        }
      };
      img.onerror = () => {
        if (mounted) setLoading(false);
      };
      img.src = featuredImage;
      return;
    }

    (async () => {
      try {
        const url = await appwriteService.getFilePreview(featuredImage);
        if (!mounted) return;

        if (!url) {
          // no preview available
          setLoading(false);
          return;
        }

        // Preload the image so we show spinner until fully loaded
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            setBgUrl(url);
            setLoading(false);
          }
        };
        img.onerror = () => {
          if (mounted) setLoading(false);
        };
        img.src = url;
      } catch (err) {
        console.error("PostCard :: getFilePreview error", err);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [featuredImage]);

  const trimmedTitle = title?.length > 70 ? title.slice(0, 67) + "..." : title;

  const isExternal = $id && $id.startsWith("medium-");
  const linkPath = isExternal ? `/external-post/${$id}` : `/post/${$id}`;

  return (
    <Link
      to={linkPath}
      aria-label={title}
      className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 will-change-transform bg-white"
    >
      {/* background image or placeholder */}
      <div
        className="w-full aspect-video bg-cover bg-center flex items-center justify-center relative"
        style={
          bgUrl
            ? { backgroundImage: `url(${bgUrl})` }
            : { backgroundColor: "#f3f4f6" }
        }
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <svg
              className="animate-spin h-8 w-8 text-gray-500"
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

        {/* Placeholder when no image */}
        {!bgUrl && !loading && (
          <div className="flex flex-col items-center justify-center gap-2 px-4">
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
            <span className="text-sm text-gray-500">No preview available</span>
          </div>
        )}

        {/* Bottom gradient overlay with title for readability */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
          <h3 className="text-white text-sm font-semibold line-clamp-2">
            {trimmedTitle}
          </h3>
        </div>
      </div>

      {/* text block (kept for spacing/structure) */}
      <div className="p-4 bg-white">
        <h2 className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
          {trimmedTitle}
        </h2>
      </div>
    </Link>
  );
}
