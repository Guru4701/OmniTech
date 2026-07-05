import React, { useState } from "react";
import { COURSES } from "../data";
import { GraduationCap, Sparkles, BookOpen, Check, HelpCircle, Award, Trophy } from "lucide-react";

export default function LearningAcademy() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("course-1");
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizVerified, setQuizVerified] = useState(false);
  const [unlockedCertificates, setUnlockedCertificates] = useState<string[]>([]);

  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  const handleSelectAnswer = (idx: number) => {
    if (quizVerified) return;
    setSelectedAnswer(idx);
  };

  const handleVerifyAnswer = (correctIndex: number) => {
    if (selectedAnswer === null) return;
    setQuizVerified(true);
    if (selectedAnswer === correctIndex) {
      // Unlock certificate
      if (!unlockedCertificates.includes(activeCourse.id)) {
        setUnlockedCertificates((prev) => [...prev, activeCourse.id]);
      }
    }
  };

  const resetQuiz = () => {
    setActiveQuizIndex(null);
    setSelectedAnswer(null);
    setQuizVerified(false);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-cyan-400" /> Learning Academy
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          Build practical hardware engineering knowledge. Study silicon lithography nodes, memory bus designs, or local inference quantizations, and test your understanding via interactive quizzes.
        </p>
      </div>

      {/* Main split dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Course Catalog selectors */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" /> Available Courses
          </h3>

          <div className="space-y-3">
            {COURSES.map((course) => {
              const hasCert = unlockedCertificates.includes(course.id);
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    resetQuiz();
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    course.id === selectedCourseId
                      ? "bg-cyan-500/10 border-cyan-500/35 text-white"
                      : "bg-zinc-900/60 border-zinc-850 text-zinc-300 hover:border-zinc-800"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                      <span className="text-purple-400 font-bold">{course.category}</span>
                      <span>{course.duration}</span>
                    </div>
                    <h4 className="text-xs font-sans font-bold leading-snug">
                      {course.title}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-850/40">
                    <span className="bg-zinc-950 px-2 py-0.5 rounded text-zinc-400">{course.level}</span>
                    {hasCert && (
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <Award className="w-3.5 h-3.5 text-emerald-400" /> CERTIFIED
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Curriculum & Quiz Overlay Panel */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

          {/* Heading info */}
          <div className="space-y-3 pb-5 border-b border-zinc-850">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{activeCourse.category}</span>
            <h3 className="text-xl font-sans font-bold text-white tracking-tight leading-snug">{activeCourse.title}</h3>
            <p className="text-zinc-400 text-xs">Curriculum modules trace development boundaries and underlying physical parameters.</p>
          </div>

          {/* Core Lesson Roadmap */}
          {activeQuizIndex === null ? (
            <div className="space-y-5">
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider">Lesson Roadmap</h4>
              <div className="space-y-3">
                {activeCourse.roadmap.map((lesson, index) => (
                  <div key={index} className="flex items-start gap-3 bg-zinc-900/20 p-3.5 rounded-xl border border-zinc-850">
                    <div className="w-5.5 h-5.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-[10px] font-mono shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-200 block">{lesson}</span>
                      <span className="text-[10px] text-zinc-500 block font-mono mt-0.5">Sustained core compile validated</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz Activation CTA */}
              <div className="pt-4 border-t border-zinc-850 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-400">Ready to evaluate your knowledge and unlock your certificate?</span>
                <button
                  onClick={() => setActiveQuizIndex(0)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
                >
                  Start Quiz Challenge
                </button>
              </div>
            </div>
          ) : (
            // Quiz panel
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
                <span className="text-xs font-mono text-zinc-500">Course Quiz Challenge</span>
                <button 
                  onClick={resetQuiz}
                  className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors uppercase"
                >
                  Exit Quiz
                </button>
              </div>

              {/* Active Quiz Question */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-white leading-snug">
                  Q: {activeCourse.quizzes[activeQuizIndex].question}
                </h4>

                {/* Option buttons */}
                <div className="space-y-2">
                  {activeCourse.quizzes[activeQuizIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === activeCourse.quizzes[activeQuizIndex].answerIndex;
                    
                    let bgStyle = "bg-zinc-900/40 border-zinc-850 hover:border-zinc-800 text-zinc-300";
                    if (isSelected) {
                      bgStyle = "bg-cyan-500/10 border-cyan-500/30 text-white";
                    }
                    if (quizVerified) {
                      if (isCorrect) {
                        bgStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold";
                      } else if (isSelected) {
                        bgStyle = "bg-red-500/10 border-red-500/30 text-red-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={quizVerified}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${bgStyle}`}
                      >
                        <span className="font-mono text-zinc-500">{String.fromCharCode(65 + idx)}.</span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evaluation explanations feedback */}
              {quizVerified && (
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-850 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-bold flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Explanation Key
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed pl-1.5">
                    {activeCourse.quizzes[activeQuizIndex].explanation}
                  </p>
                </div>
              )}

              {/* Control buttons */}
              <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
                <div>
                  {selectedAnswer === null && (
                    <span className="text-[10px] text-zinc-500 font-mono">Select an option to evaluate.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!quizVerified ? (
                    <button
                      onClick={() => handleVerifyAnswer(activeCourse.quizzes[activeQuizIndex].answerIndex)}
                      disabled={selectedAnswer === null}
                      className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Verify Answer
                    </button>
                  ) : (
                    <>
                      {activeQuizIndex + 1 < activeCourse.quizzes.length ? (
                        <button
                          onClick={() => {
                            setActiveQuizIndex(activeQuizIndex + 1);
                            setSelectedAnswer(null);
                            setQuizVerified(false);
                          }}
                          className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={resetQuiz}
                          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Trophy className="w-4 h-4 fill-zinc-950" /> Claim Certificate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
