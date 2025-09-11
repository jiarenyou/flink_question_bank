import React, { useState } from 'react';
import type { Question } from '../types';
import { QuestionType, Level } from '../types';
import { GoogleGenAI } from "@google/genai";

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const LevelBadge: React.FC<{ level: Level }> = ({ level }) => {
  const levelStyles: { [key in Level]: string } = {
    [Level.Easy]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [Level.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [Level.Hard]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  const levelText: { [key in Level]: string } = {
    [Level.Easy]: '简单',
    [Level.Medium]: '中等',
    [Level.Hard]: '困难',
  };
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${levelStyles[level]}`}>
      {levelText[level]}
    </span>
  );
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, onNext, isLastQuestion }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [followUpQuestion, setFollowUpQuestion] = useState<string>('');
  const [geminiResponse, setGeminiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    
    const optionLetter = option.split(')')[0];
    setSelectedOption(optionLetter);
    setIsAnswered(true);
    onAnswer(optionLetter === question.correct_answer);
  };

  const handleShowAnswer = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    // For QA, correctness is not auto-graded
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpQuestion.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeminiResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const prompt = `
        您是一位 Apache Flink 架构师和技术面试官专家。一位用户正在练习以下面试题：

        **原始问题:**
        ${question.question}

        **正确答案 / 参考答案:**
        ${question.correct_answer}

        **提供的解释:**
        ${question.explanation}

        用户有以下后续问题或想法：
        **用户的问题:**
        ${followUpQuestion}

        请用中文为用户的问题提供清晰、简洁、有帮助的回答。帮助他们更好地理解相关概念。
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setGeminiResponse(response.text);

    } catch (err) {
      console.error('Error calling Gemini API:', err);
      setError('抱歉，回答时出现问题，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600';
    }
    const optionLetter = option.split(')')[0];
    const isCorrect = optionLetter === question.correct_answer;
    const isSelected = optionLetter === selectedOption;

    if (isCorrect) {
      return 'bg-green-100 dark:bg-green-800 border-green-400 dark:border-green-600 text-green-800 dark:text-green-100';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-100 dark:bg-red-800 border-red-400 dark:border-red-600 text-red-800 dark:text-red-100';
    }
    return 'bg-white dark:bg-slate-700 opacity-70';
  };
  
  const showExplanation = isAnswered && (
    (question.type === QuestionType.MultipleChoice && selectedOption !== question.correct_answer) || 
    question.type === QuestionType.QA
  );

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 sm:p-8 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">问题 #{question.id}</h2>
        <LevelBadge level={question.level} />
      </div>
      <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 mb-6">{question.question}</p>

      {question.type === QuestionType.MultipleChoice && (
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition-all duration-200 ${getOptionClass(option)} disabled:cursor-not-allowed`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === QuestionType.QA && !isAnswered && (
        <div className="flex flex-col items-start">
            <textarea
                rows={5}
                className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="在此输入你的答案..."
            />
            <button
                onClick={handleShowAnswer}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
                显示答案
            </button>
        </div>
      )}
      
      {isAnswered && (
        <div className="mt-6 space-y-6 animate-fade-in">
          {question.type === QuestionType.QA && (
            <div>
              <h3 className="text-md font-bold text-slate-700 dark:text-slate-200 mb-2">正确答案</h3>
              <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg text-slate-800 dark:text-slate-300 whitespace-pre-wrap">{question.correct_answer}</div>
            </div>
          )}

          {showExplanation && (
            <div>
              <h3 className="text-md font-bold text-slate-700 dark:text-slate-200 mb-2">解释</h3>
              <p className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-300">{question.explanation}</p>
            </div>
          )}

          <div>
            <h3 className="text-md font-bold text-slate-700 dark:text-slate-200 mb-2">知识扩展</h3>
            <p className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-slate-800 dark:text-slate-300">{question.extension}</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-md font-bold text-slate-700 dark:text-slate-200 mb-3">还有其他疑问吗？</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              对于这个问题或相关概念，如果你有自己的想法或疑问，可以在下方提出，AI 专家会为你解答。
            </p>
            <div className="flex flex-col items-start">
              <textarea
                rows={4}
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                className="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：你能举一个关于“迟到事件”在真实世界中的例子吗？"
                disabled={isLoading}
              />
              <button
                onClick={handleFollowUpSubmit}
                disabled={isLoading || !followUpQuestion.trim()}
                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isLoading ? '正在思考中...' : '提交问题'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            
            {geminiResponse && (
              <div className="mt-4">
                <h4 className="text-md font-bold text-slate-700 dark:text-slate-200 mb-2">AI 专家解答</h4>
                <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-slate-800 dark:text-slate-300 whitespace-pre-wrap font-sans">
                  {geminiResponse}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-right">
             <button
              onClick={onNext}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLastQuestion ? '完成测验' : '下一题'}
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;