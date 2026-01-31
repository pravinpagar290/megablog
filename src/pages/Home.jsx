import React, { useCallback, useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import axios from "axios";
import { data } from "react-router-dom";
import { login } from "../store/authSlice";
import ExternalBlog from "./ExternalBlog";

function Home() {
  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);
  const userName = useSelector((state) => state.auth.userData?.name);
  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          {authStatus ? (
            <h2 className="text-2xl">
              Welcome back, {userName}! No posts available.
            </h2>
          ) : (
            <h2 className="text-2xl">
              No posts available. Please check back later.
            </h2>
          )}
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
      <ExternalBlog/>
    </div>
  );
}

export default Home;
