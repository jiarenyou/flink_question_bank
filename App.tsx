import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from './types';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';
import QuizSetup from './components/QuizSetup';
import type { QuizSettings } from './components/QuizSetup';

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<'setup' | 'active' | 'finished'>('setup');
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async () => {
    if (!quizSettings) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuestion(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const questionSchema = {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.NUMBER, description: "问题的唯一编号，可以使用时间戳。" },
          type: { type: Type.STRING, description: '必须是 "multiple-choice" 或 "qa"。' },
          level: { type: Type.STRING, description: '必须是 "easy"、"medium" 或 "hard"。' },
          question: { type: Type.STRING, description: "问题文本，必须是中文。" },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '对于 "multiple-choice" 类型的问题，这是一个包含4个选项字符串的数组（例如：["A) ...", "B) ..."]）。对于 "qa" 类型的问题，这必须是一个空数组。选项内容必须是中文。'
          },
          correct_answer: {
            type: Type.STRING,
            description: '对于 "multiple-choice"，这是正确选项的字母（例如："A", "B", "C", "D"）。对于 "qa"，这是详细的正确答案文本。必须是中文。'
          },
          explanation: { type: Type.STRING, description: "对正确答案的详细解释。必须是中文。" },
          extension: { type: Type.STRING, description: "一个用于引导更深入思考的后续问题或知识扩展。必须是中文。" }
        },
        required: ['id', 'type', 'level', 'question', 'options', 'correct_answer', 'explanation', 'extension']
      };

      const previousQuestions = answeredQuestions.map(q => q.question).join('\n - ');

      const difficultyInstruction = quizSettings.level === 'any' 
        ? '难度等级可以是 "easy"、"medium" 或 "hard" 中的任意一种。' 
        : `难度等级必须是 "${quizSettings.level}"。`;
        
      const typeInstruction = quizSettings.type === 'any'
        ? '问题类型可以是 "multiple-choice" 或 "qa" 中的任意一种。'
        : `问题类型必须是 "${quizSettings.type}"。`;

      const prompt = `
        你是一位 Apache Flink 架构师和技术面试官专家。
        你的任务是根据 Flink 的官方文档和高级技术博客，创建一个具有挑战性和相关性的 Flink 面试题。
        
        请严格遵守以下要求生成题目：
        1. ${difficultyInstruction}
        2. ${typeInstruction}

        请生成一个独特的 Apache Flink 面试题，该题目不能是以下列表中已有的问题：
        ${previousQuestions ? `- ${previousQuestions}` : '（暂无历史题目）'}

        请根据提供的 schema 以 JSON 格式返回响应。
        所有内容（问题、选项、答案、解释等）都必须使用中文。
        对于选择题，请确保选项以 'A) '、'B) '、'C) '、'D) ' 作为前缀。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: questionSchema,
        },
      });
      
      const jsonResponse = JSON.parse(response.text);
      
      if (!jsonResponse.question || !jsonResponse.correct_answer) {
        throw new Error("从 API 收到了无效的问题格式。");
      }

      const newQuestion: Question = {
          ...jsonResponse,
          id: Date.now()
      };
      
      setCurrentQuestion(newQuestion);

    } catch (err) {
      console.error("生成题目时出错:", err);
      setError("生成题目时遇到问题，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }, [answeredQuestions, quizSettings]);

  useEffect(() => {
    if (quizState === 'active' && answeredQuestions.length < TOTAL_QUESTIONS) {
      generateQuestion();
    }
  }, [quizState, answeredQuestions.length, generateQuestion]);


  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  }, []);

  const handleNextQuestion = () => {
    const newAnsweredQuestions = [...answeredQuestions, currentQuestion!];
    setAnsweredQuestions(newAnsweredQuestions);

    if (newAnsweredQuestions.length >= TOTAL_QUESTIONS) {
      setQuizState('finished');
    } else {
       // The useEffect will trigger the next question generation
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(null);
    setAnsweredQuestions([]);
    setScore(0);
    setQuizSettings(null);
    setQuizState('setup');
  };
  
  const handleStartQuiz = (settings: QuizSettings) => {
    setQuizSettings(settings);
    setAnsweredQuestions([]);
    setScore(0);
    setCurrentQuestion(null);
    setQuizState('active');
  };
  
  const renderContent = () => {
    switch (quizState) {
      case 'setup':
        return <QuizSetup onStartQuiz={handleStartQuiz} />;
      
      case 'finished':
        return (
          <ResultsScreen 
            score={score} 
            totalQuestions={TOTAL_QUESTIONS} 
            onRestart={handleRestart} 
          />
        );

      case 'active':
        if (isLoading && !currentQuestion) {
          return (
            <div className="flex flex-col justify-center items-center p-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">正在为您生成新的 Flink 题目...</p>
            </div>
          );
        }
        
        if (error) {
           return (
            <div className="text-center p-10 bg-red-50 dark:bg-red-900/50 rounded-xl shadow-lg min-h-[400px] flex flex-col justify-center items-center">
              <p className="text-red-700 dark:text-red-300 mb-6 font-semibold">{error}</p>
              <button 
                onClick={generateQuestion} 
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                重试
              </button>
            </div>
          );
        }
        
        if (currentQuestion) {
          return (
             <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswer={handleAnswer}
                onNext={handleNextQuestion}
                isLastQuestion={answeredQuestions.length === TOTAL_QUESTIONS - 1}
              />
          );
        }
    
        return null;

      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <Header 
          currentQuestion={answeredQuestions.length + 1} 
          totalQuestions={TOTAL_QUESTIONS} 
          isQuizActive={quizState === 'active'}
        />
        <main className="mt-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;