import mongoose from "mongoose";
import { connect_database } from "../config/database";
import { QuestionModel } from "../models/question";

const questions_data = [
    {
        question: "Explain the concept of closures in JavaScript and provide a practical use case where closures are beneficial.",
    },
    {
        question: "What is the difference between SQL and NoSQL databases? When would you choose one over the other?",
    },
    {
        question: "Describe the RESTful API principles and explain what makes an API truly RESTful.",
    },
    {
        question: "What is the purpose of middleware in Express.js? Provide an example of a custom middleware function.",
    },
    {
        question: "Explain the concept of promises and async/await in JavaScript. How do they improve asynchronous code handling?",
    },
    {
        question: "What are the key differences between TypeScript and JavaScript? What are the main benefits of using TypeScript?",
    },
    {
        question: "Describe the SOLID principles in software engineering and explain how they contribute to better code design.",
    },
];

const seed_questions = async (): Promise<void> => {
    console.log("Starting question seeding...");

    // Clear existing questions
    const deleted_count = await QuestionModel.deleteMany({});
    console.log(`Cleared ${deleted_count.deletedCount} existing questions`);

    // Insert new questions
    const created_questions = await QuestionModel.insertMany(questions_data);
    console.log(`Successfully seeded ${created_questions.length} questions`);

    // Display created questions
    created_questions.forEach((question, index) => {
        console.log(`${index + 1}. ${question.question.substring(0, 50)}...`);
    });
};

const run_seed = async (): Promise<void> => {
    await connect_database();
    await seed_questions();
    await mongoose.connection.close();
    console.log("Database connection closed. Seeding complete!");
    process.exit(0);
};

run_seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});

