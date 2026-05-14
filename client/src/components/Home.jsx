import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/user-api/articles`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          setArticles((res.data.payload || []).slice(0, 4));
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const openArticle = (article) => {
    if (!article?._id) return;

    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const goToAllArticles = () => {
    navigate("/user-profile");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-blue-300">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading articles...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-blue-50 to-purple-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-purple-100">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HERO SECTION */}
        <div className="text-center mb-16 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg p-10 border border-white/50">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyBlog
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover insightful articles on technology,
            programming.        
</p>
          <button
            onClick={goToAllArticles}
            className="mt-8 px-8 py-3 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Explore Articles
          </button>
        </div>

        {/* ARTICLES HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Latest Articles
          </h2>

          <button
            onClick={goToAllArticles}
            className="text-blue-600 font-medium hover:text-purple-600 transition"
          >
            View All →
          </button>
        </div>

        {/* EMPTY STATE */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-10 text-center text-gray-500">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-lg">No articles yet</p>
            <p className="text-sm">
              Be the first to explore content
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-md border border-white/50 p-6 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              >
                <div className="flex flex-col h-full">

                  {/* CATEGORY */}
                  <span className="inline-block w-fit px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 mb-3 capitalize">
                    {article.category}
                  </span>

                  {/* TITLE */}
                  <h3 className="text-lg font-bold text-gray-800 hover:text-purple-600 transition">
                    {article.title}
                  </h3>

                  {/* CONTENT */}
                  <p className="text-sm text-gray-600 mt-3 grow">
                    {article.content?.slice(0, 90) ||
                      "No content"}
                    ...
                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={() => openArticle(article)}
                    className="mt-5 text-sm font-semibold text-purple-600 hover:text-blue-600 transition"
                  >
                    Read More →
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;