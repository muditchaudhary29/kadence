import React, { useState } from 'react';
import {
  MessageSquare, Star, Send, CheckCircle2, Trash2, User,
  Sparkles, Filter, Heart, ThumbsUp, AlertCircle
} from 'lucide-react';
import { saveUserFeedback, getUserFeedbacks, deleteUserFeedback } from '../utils/storage';

const CATEGORIES = [
  'Speech Recognition & Accuracy',
  'WPM & Pacing Analysis',
  'STAR Method Evaluation',
  'UI/UX & 3D Design',
  'Feature Suggestion',
  'General Feedback'
];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(() => getUserFeedbacks());
  const [rating, setRating]       = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory]   = useState(CATEGORIES[0]);
  const [name, setName]           = useState('');
  const [role, setRole]           = useState('');
  const [comment, setComment]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newEntry = saveUserFeedback({
      rating,
      category,
      name: name.trim() || 'Anonymous User',
      role: role.trim() || 'Interview Candidate',
      comment: comment.trim(),
    });

    setFeedbacks(prev => [newEntry, ...prev.filter(f => f.id !== newEntry.id)]);
    setComment('');
    setName('');
    setRole('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleDelete = (id) => {
    const updated = deleteUserFeedback(id);
    setFeedbacks(updated);
  };

  // Filter list
  const filteredFeedbacks = selectedFilter === 'All'
    ? feedbacks
    : feedbacks.filter(f => f.category === selectedFilter);

  // Compute average rating
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((a, f) => a + (f.rating || 5), 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            User Feedback & Reviews
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Share your experience, suggest new features, or report issues to help us improve VoiceCraft.
          </p>
        </div>

        {/* Rating summary badge */}
        <div className="glass-card px-4 py-2 rounded-2xl border border-purple-500/20 bg-purple-500/10 flex items-center gap-3 shrink-0">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
            ))}
          </div>
          <div>
            <div className="text-sm font-black text-white">{avgRating} / 5.0</div>
            <div className="text-[10px] text-purple-300 font-medium">{feedbacks.length} User Review{feedbacks.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Form & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Submit Feedback Form (5 cols on lg) */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5 sticky top-20">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-zinc-100">Submit Your Feedback</h3>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you! Your feedback has been saved successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">Overall Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-zinc-600 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            active
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                              : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-mono text-amber-400 ml-2 font-bold">{hoverRating || rating} / 5</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Feedback Topic</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/50"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Parth"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Role / Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Your Feedback & Suggestions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you liked or what features you want added..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!comment.trim()}
                className="w-full btn-primary text-xs justify-center py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #9333EA, #7C3AED)' }}
              >
                <Send className="w-3.5 h-3.5" />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Saved Feedbacks List (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-zinc-500 font-medium mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedFilter === cat
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat === 'All' ? 'All Reviews' : cat.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Feedback Cards List */}
          {filteredFeedbacks.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-zinc-800">
              <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">No feedbacks in this category</p>
              <p className="text-xs text-zinc-500">Be the first to submit a review on the left!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedbacks.map((f) => {
                const dateObj = new Date(f.date);
                const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                return (
                  <div
                    key={f.id}
                    className="glass-card rounded-2xl p-5 border border-white/10 space-y-3 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-100">{f.name}</div>
                          <div className="text-[11px] text-zinc-500">{f.role} · {dateStr}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center text-amber-400">
                          {[...Array(f.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          ))}
                        </div>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="p-1 text-zinc-600 hover:text-rose-400 transition-colors"
                          title="Delete feedback"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Topic Badge */}
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 tracking-wider">
                        {f.category}
                      </span>
                    </div>

                    {/* Comment content */}
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/80 italic">
                      "{f.comment}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
