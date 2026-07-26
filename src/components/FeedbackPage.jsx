import React, { useState } from 'react';
import {
  MessageSquare, Star, Send, CheckCircle2, Trash2, User,
  Sparkles, Filter
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

  const filteredFeedbacks = selectedFilter === 'All'
    ? feedbacks
    : feedbacks.filter(f => f.category === selectedFilter);

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((a, f) => a + (f.rating || 5), 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-heading flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-purple-500" />
            User Feedback & Reviews
          </h2>
          <p className="text-sm font-medium mt-1 opacity-80">
            Share your experience, suggest new features, or report issues to help us improve Kadence AI.
          </p>
        </div>

        {/* Rating summary badge: Sunshine Yellow in Light Mode, Warm Amber in Dark Mode */}
        <div className="summary-rating-badge px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4.5 h-4.5 stroke-[2.5]" />
            ))}
          </div>
          <div>
            <div className="text-base font-black font-mono leading-none">{avgRating} / 5.0</div>
            <div className="text-[10px] font-black uppercase mt-1 tracking-wider">{feedbacks.length} User Review{feedbacks.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      {/* Form & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Submit Feedback Form */}
        <div className="lg:col-span-5">
          <div className="brutal-card p-6 space-y-5 sticky top-20">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-700">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold font-heading">Submit Feedback</h3>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-500/15 border-2 border-emerald-500 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Thank you! Your feedback has been saved successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold font-heading block mb-2">Overall Rating</label>
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
                        className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            active
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                              : 'text-zinc-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-mono font-bold text-amber-500 ml-2">{hoverRating || rating} / 5</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold font-heading block mb-1.5">Feedback Topic</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full neu-inset rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold block mb-1 opacity-80">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Parth"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full neu-inset rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold block mb-1 opacity-80">Role / Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full neu-inset rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-xs font-bold font-heading block mb-1.5">Your Feedback & Suggestions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you liked or what features you want added..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full neu-inset rounded-xl p-3 text-xs font-semibold focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!comment.trim()}
                className="w-full btn-primary text-xs justify-center py-3 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Saved Feedbacks List */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider opacity-75 shrink-0">Filter:</span>
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold font-mono whitespace-nowrap transition-all ${
                  selectedFilter === cat
                    ? 'nav-active'
                    : 'nav-inactive'
                }`}
              >
                {cat === 'All' ? 'ALL REVIEWS' : cat.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Feedback Cards List */}
          {filteredFeedbacks.length === 0 ? (
            <div className="brutal-card p-8 text-center space-y-2">
              <MessageSquare className="w-8 h-8 opacity-50 mx-auto" />
              <p className="text-base font-bold font-heading">No feedbacks in this category</p>
              <p className="text-xs opacity-75">Be the first to submit a review on the left!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((f) => {
                const dateObj = new Date(f.date);
                const dateStr = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                return (
                  <div
                    key={f.id}
                    className="brutal-card p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500 text-white border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-base font-bold font-heading">{f.name}</div>
                          <div className="text-xs font-mono opacity-75">{f.role} · {dateStr}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center text-amber-400">
                          {[...Array(f.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                          ))}
                        </div>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="p-1 text-rose-500 hover:scale-110 transition-transform"
                          title="Delete feedback"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="brutal-badge bg-purple-500/20 text-purple-400 border-purple-500/40 text-[10px]">
                        {f.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium font-sans leading-relaxed neu-inset p-3.5 rounded-xl italic">
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
