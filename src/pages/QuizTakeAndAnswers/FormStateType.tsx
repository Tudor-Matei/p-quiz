export interface IFormState {
  [questionTitle: string]: { title: string; markedAsCorrect: boolean }[];
}

export interface IFormRawData {
  title: string;
  type: "single" | "multiple";
  options: string[];
}

export interface IDataResults {
  title: string;
  isCorrect: boolean;
}

export interface IFormStateError {
  [questionTitle: string]: string | undefined;
}
