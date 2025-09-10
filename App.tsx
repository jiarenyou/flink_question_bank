
import React, { useState, useCallback } from 'react';
import { flinkQuestions } from './data/questions';
import type { Question } from './types';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [questions] = useState<Question[]>(flinkQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isQuizOver, setIsQuizOver] = useState<boolean>(false);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  }, []);

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setIsQuizOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizOver(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <Header 
          currentQuestion={currentQuestionIndex + 1} 
          totalQuestions={questions.length} 
          isQuizOver={isQuizOver}
        />
        <main className="mt-6">
          {isQuizOver ? (
            <ResultsScreen 
              score={score} 
              totalQuestions={questions.length} 
              onRestart={handleRestart} 
            />
          ) : (
            <QuestionCard
              key={currentQuestionIndex}
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              onNext={handleNextQuestion}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
