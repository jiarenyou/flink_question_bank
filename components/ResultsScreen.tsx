
import React from 'react';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  let message = '';
  if (percentage >= 80) {
    message = "太棒了！你对 Flink 的概念有非常扎实的掌握。";
  } else if (percentage >= 50) {
    message = "做得不错！稍加练习，你就能成为专家。";
  } else {
    message = "继续努力！回顾解析有助于巩固你的知识。";
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-8 text-center animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">测验完成！</h2>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
        你答对了 {totalQuestions} 题中的 {score} 题。
      </p>
      
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}>
        </div>
      </div>
      <p className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-6">{percentage}%</p>
      
      <p className="text-md sm:text-lg text-slate-700 dark:text-slate-200 mb-8">{message}</p>
      
      <button
        onClick={onRestart}
        className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        再试一次
      </button>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ResultsScreen;
