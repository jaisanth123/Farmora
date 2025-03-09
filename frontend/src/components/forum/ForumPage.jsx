// src/components/forum/ForumPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForumTopicsList from "./ForumTopicsList";
import ForumPostsList from "./ForumPostsList";
import ForumPostDetail from "./ForumPostDetail";
import ForumHeader from "./ForumHeader";
import CreatePostForm from "./CreatePostForm";
import { forumTopics } from "./forumData";

const ForumPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("topics"); // topics, posts, post-detail, create-post
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState({
    "crop-suggestion": [
      {
        id: "cs-1",
        title: "Best crop for clay soil in North India?",
        author: "Ravi Kumar",
        date: "2025-03-05",
        content:
          "My soil testing shows high clay content. What crops would work best for the upcoming season in Punjab region?",
        likes: 12,
        replies: 8,
        authorAvatar: "/assets/avatars/farmer1.jpg",
        images: [],
      },
      {
        id: "cs-2",
        title: "Crop rotation suggestions for wheat fields",
        author: "Anita Singh",
        date: "2025-03-02",
        content:
          "I've been growing wheat for the past two seasons. What should I rotate with for soil health?",
        likes: 9,
        replies: 11,
        authorAvatar: "/assets/avatars/farmer2.jpg",
        images: [],
      },
    ],
    "disease-prediction": [
      {
        id: "dp-1",
        title: "Yellow spots on rice leaves - what could it be?",
        author: "Mohan Reddy",
        date: "2025-03-07",
        content:
          "My rice crop has developed yellow spots on the leaves. The spots are small and scattered. Could this be Rice Blast or something else?",
        likes: 7,
        replies: 15,
        authorAvatar: "/assets/avatars/farmer3.jpg",
        images: ["/assets/forum/rice-disease.jpg"],
      },
    ],
    general: [
      {
        id: "g-1",
        title: "How's everyone preparing for the monsoon season?",
        author: "Priya Sharma",
        date: "2025-03-01",
        content:
          "With monsoon approaching in a few months, I'm curious what preparations other farmers are making. Any special measures for drainage or crop protection?",
        likes: 18,
        replies: 22,
        authorAvatar: "/assets/avatars/farmer4.jpg",
        images: [],
      },
      {
        id: "g-2",
        title: "Farmer's market in Delhi this weekend",
        author: "Ajay Verma",
        date: "2025-03-06",
        content:
          "Just wanted to share that there's a farmer's market this weekend at Connaught Place. Great opportunity to showcase produce and network!",
        likes: 24,
        replies: 5,
        authorAvatar: "/assets/avatars/farmer5.jpg",
        images: [],
      },
    ],
    "market-trends": [],
    "farming-tech": [],
  });

  // Navigation functions
  const goBack = () => {
    if (view === "posts") {
      setView("topics");
    } else if (view === "post-detail") {
      setView("posts");
    } else if (view === "create-post") {
      setView(selectedTopic ? "posts" : "topics");
    }
  };

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setView("posts");
  };

  const handlePostSelect = (postId) => {
    const post = posts[selectedTopic].find((p) => p.id === postId);
    setSelectedPost(post);
    setView("post-detail");
  };

  const handleCreatePost = () => {
    setView("create-post");
  };

  const handleSubmitPost = (newPost, topicId) => {
    setPosts((prevPosts) => ({
      ...prevPosts,
      [topicId]: [newPost, ...(prevPosts[topicId] || [])],
    }));

    // Go to posts view after submission
    setSelectedTopic(topicId);
    setView("posts");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ForumHeader
        view={view}
        goBack={goBack}
        handleCreatePost={handleCreatePost}
      />

      <div className="mt-4">
        {view === "topics" && (
          <ForumTopicsList
            topics={forumTopics}
            onSelectTopic={handleTopicSelect}
          />
        )}

        {view === "posts" && selectedTopic && (
          <ForumPostsList
            topic={forumTopics.find((t) => t.id === selectedTopic)}
            posts={posts[selectedTopic] || []}
            onSelectPost={handlePostSelect}
          />
        )}

        {view === "post-detail" && selectedPost && (
          <ForumPostDetail post={selectedPost} />
        )}

        {view === "create-post" && (
          <CreatePostForm
            onCancel={goBack}
            onSubmit={handleSubmitPost}
            topics={forumTopics}
            initialTopic={selectedTopic || "general"}
          />
        )}
      </div>
    </div>
  );
};

export default ForumPage;
