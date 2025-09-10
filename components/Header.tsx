
import React from 'react';

interface HeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  isQuizOver: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentQuestion, totalQuestions, isQuizOver }) => {
  return (
    <header className="text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
        Flink 技术面试练习
      </h1>
      {!isQuizOver && (
         <p className="mt-2 text-md sm:text-lg text-slate-600 dark:text-slate-400">
          第 {currentQuestion} 题 / 共 {totalQuestions} 题
        </p>
      )}
    </header>
  );
};

export default Header;
