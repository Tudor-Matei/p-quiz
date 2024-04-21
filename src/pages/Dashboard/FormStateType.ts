interface IQuestion {
  title: string;
  type: "single" | "multiple";
  options: { title: string; isCorrectAnswer: boolean }[];
}

interface IFormState {
  title: string;
  subject: string;
  tags: string;
  questions: IQuestion[];
}

interface IFormStateError {
  title?: string;
  subject?: string;
  tags?: string;
  questions?: string;
  options?: string;
}

export type { IQuestion, IFormState, IFormStateError };
