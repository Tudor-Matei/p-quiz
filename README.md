# p-quiz

p-quiz is a website designed for quiz-taking, catering to both students and teachers. Users can
register an account and choose their role as a student or a teacher. Teachers have the ability to
create quizzes, while all users can take quizzes available on the platform.

# Features & pages

## Main Page

The main page serves as the entry point to the p-quiz website. It features the p-quiz logo,
introductory information about the platform, and contact details for getting in touch with the
p-quiz team.

## Sign Up and Sign In Pages

The Sign Up and Sign In pages allow users to create a new account or sign in to an existing
account, respectively. Each page consists of a form where users can enter their details and
initiate the corresponding action.

## Dashboard Page

The Dashboard page is accessible only to logged-in users. It provides an overview of the
user's account details. For teacher users, the Dashboard page also includes a form for adding
questions to quizzes.

## Quizzes Page

The Quizzes page displays all the quizzes registered on the platform. Each quiz is represented
by its title, subject, tags, and question count. Users can click on a quiz to access the quiz-
taking page.

## Quiz-Taking Page

The Quiz-Taking page presents a form where users can complete a quiz. Upon submitting the
quiz, the user immediately receives the results.

# Stack

## Frontend

The frontend of p-quiz is built using React and TypeScript. Form handling is facilitated by
Formik. The website is developed as a single-page application (SPA) and bundled using Vite,
which serves as the bundler for the project.

## Backend

The backend of p-quiz is built using PHP and utilizes MySQL for data storage. The backend
is served through XAMPP, providing a suitable environment for PHP execution. The PHP
server exposes endpoints that handle requests from the frontend and respond with appropriate
results.

# How to run it

- clone the repository
- boot up a PHP server and link it with the PHP files of this project
  - in the case of XAMPP, put the files of this repository inside the `htdocs` folder
- import the schemas in `php/db/schemas`
- run `npm install` to install dependencies
- run `npm run dev` for development
- run `npm run build` and `npm run preview` for a production build and preview
