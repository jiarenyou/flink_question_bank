import React, { useState } from 'react';
import { QuestionType, Level } from '../types';

export interface QuizSettings {
  level: Level | 'any';
  type: QuestionType | 'any';
}

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

const OptionButton: React.FC<{
  value: string;
  label: string;
  selectedValue: string;
  onSelect: (value: any) => void;
}> = ({ value, label, selectedValue, onSelect }) => {
  const isSelected = value === selectedValue;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`px-4 py-2 text-sm sm:text-base sm:px-6 sm:py-2.5 font-semibold rounded-lg transition-all duration-200 border-2 ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );
};


const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [level, setLevel] = useState<Level | 'any'>('any');
  const [type, setType] = useState<QuestionType | 'any'>('any');

  const levelOptions: { value: Level | 'any', label: string }[] = [
    { value: 'any', label: '任意' },
    { value: Level.Easy, label: '简单' },
    { value: Level.Medium, label: '中等' },
    { value: Level.Hard, label: '困难' },
  ];

  const typeOptions: { value: QuestionType | 'any', label: string }[] = [
    { value: 'any', label: '任意' },
    { value: QuestionType.MultipleChoice, label: '选择题' },
    { value: QuestionType.QA, label: '问答题' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz({ level, type });
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 sm:p-10 text-center animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4">自定义你的 Flink 测验</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">请选择题目难度和类型，开始你的练习吧！</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <label className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">难度等级</label>
                <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                   {levelOptions.map(opt => (
                     <OptionButton key={opt.value} value={opt.value} label={opt.label} selectedValue={level} onSelect={setLevel} />
                   ))}
                </div>
            </div>

            <div>
                <label className="block text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">题目类型</label>
                 <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                    {typeOptions.map(opt => (
                      <OptionButton key={opt.value} value={opt.value} label={opt.label} selectedValue={type} onSelect={setType} />
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full sm:w-auto px-12 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg"
                >
                    开始测验
                </button>
            </div>
        </form>
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

export default QuizSetup;
