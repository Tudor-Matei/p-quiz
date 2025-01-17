import { IFormState } from "../pages/QuizTakeAndAnswers/FormStateType";

import { IDataResults } from "../pages/QuizTakeAndAnswers/FormStateType";
import { IQuestion } from "./IQuiz";

export default function computeResults(questions: IQuestion[], answers: IFormState): IDataResults[] {
  const resultsData: IDataResults[] = [];
  for (const question of questions) {
    const answersForCurrentQuestion = answers[question.title];
    let isCorrectSoFar = true;
    for (const currentAnswer of answersForCurrentQuestion) {
      const correctAnswerOption = question.options.find(({ title }) => title === currentAnswer.title);
      if (correctAnswerOption === undefined) continue;

      if (
        (!correctAnswerOption.isCorrectAnswer && currentAnswer.markedAsCorrect) ||
        (correctAnswerOption.isCorrectAnswer && !currentAnswer.markedAsCorrect)
      ) {
        isCorrectSoFar = false;
        break;
      }
    }
    resultsData.push({ title: question.title, isCorrect: isCorrectSoFar });
  }

  return resultsData;
}
