
export enum QuestionType {
  MultipleChoice = "multiple-choice",
  QA = "qa",
}

export enum Level {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export interface Question {
  id: number;
  type: QuestionType;
  level: Level;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  extension: string;
}
