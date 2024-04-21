export interface IQuestionResponse {
  id: string;
  title: string;
  subject: string;
  tags: string;
  questions: string;
}

export interface IQuestion {
  title: string;
  type: "single" | "multiple";
  options: IOption[];
}

export interface IOption {
  title: string;
  isCorrectAnswer: boolean;
}

export interface IQuiz {
  id: string;
  title: string;
  subject: string;
  tags: string;
  questions: IQuestion[];
}
