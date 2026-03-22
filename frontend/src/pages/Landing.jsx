import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Brain, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  // Handle CTA click
  const handleExplore = () => {
    const userStr = localStorage.getItem("user");

    let userData = null;
    try {
      userData = JSON.parse(userStr);
    } catch {
      userData = null;
    }

    if (userData && userData.name) {
      navigate("/restaurants");
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      document.dispatchEvent(new Event("openLoginModal"));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Feature cards
  const features = [
    {
      icon: <Brain className="w-7 h-7 text-violet-600" />,
      title: "AI Analysis",
      desc: "Advanced NLP extracts real sentiment from every review.",
      bg: "bg-violet-100",
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-fuchsia-600" />,
      title: "Live Rankings",
      desc: "Restaurants ranked dynamically based on real-time feedback.",
      bg: "bg-fuchsia-100",
    },
    {
      icon: <Trophy className="w-7 h-7 text-rose-600" />,
      title: "Top Destinations",
      desc: "Discover top-rated places backed by data, not hype.",
      bg: "bg-rose-100",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[url('/bg.webp')] bg-cover bg-center bg-no-repeat">
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">

        {/* Hero Section */}
        <div className="text-center mb-24">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-rose-500 rounded-3xl mb-8 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-black text-black mb-8 tracking-tight">
            The Future of
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-700 via-fuchsia-700 to-rose-600">
              Dining Discovery
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-black max-w-2xl mx-auto mb-12 font-semibold">
            We analyze real reviews using AI to rank restaurants based on what people actually feel.
          </p>

          {/* CTA */}
          <button
            onClick={handleExplore}
            className="group inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
            >
              <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {f.title}
              </h3>

              <p className="text-slate-600 text-lg leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-t from-white to-transparent -z-10" />
    </div>
  );
}