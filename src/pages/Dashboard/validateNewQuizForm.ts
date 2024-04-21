import { IFormState, IFormStateError } from "./FormStateType";

export default function validateNewQuizForm({ title, subject, tags, questions }: IFormState) {
  const errors: IFormStateError = {};

  if (title.trim() === "") errors.title = "The title is missing.";
  else if (title.length < 3) errors.title = "The title is too short. Make it at least 3 letters.";

  if (subject.trim() === "") errors.subject = "The subject is missing.";
  else if (subject.length < 3) errors.subject = "The subject name is too short. Make it at least 3 letters.";

  if (tags.trim() === "") errors.tags = "The tags are missing.";

  if (errors.options === undefined)
    questions.forEach((question, questionIndex) => {
      if (question.title.trim() === "") errors.questions = "The title is missing.";
      else if (question.title.length < 3) errors.questions = "The title is too short. Make it at least 3 letters.";

      if (question.options.length < 2) errors.options = "Any question must have at least two possible answers.";

      let isThereACorrectAnswer = false;
      const nonCompliantOptionIndex = question.options.findIndex((option) => {
        if (option.isCorrectAnswer) isThereACorrectAnswer = true;
        return option.title.trim() === "";
      });

      if (nonCompliantOptionIndex != -1)
        errors.options = `Option ${nonCompliantOptionIndex + 1} of question ${questionIndex + 1} has an empty title.`;
      else if (!isThereACorrectAnswer)
        errors.options = `No answer for question ${questionIndex + 1} is marked as correct.`;
    });

  return errors;
}
