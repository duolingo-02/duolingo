// ==============================
// Importing Dependencies and Components
// ==============================
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { containerStyles, typographyStyles } from "../../styles/styles";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";
import SentenceOrderQuiz from "./SentenceOrder";
import TrueFalseQuiz from "./TrueFalseQuiz";

// ==============================
// Importing the separated type
// ==============================
import { QuizData } from "../../types/Game";

/**
 * Play Component
 *
 * Fetches and renders the appropriate quiz component based on the type.
 */
const Play: React.FC = () => {
  // Extract languageId and stageId from URL params
  const { languageId, stageId } = useParams<{
    languageId: string;
    stageId: string;
  }>();

  // State management
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  // Fetch quiz data when component mounts
  useEffect(() => {
    axios
      .get(
        `http://localhost:1274/api/lessons/${stageId}/language/${languageId}`
      )
      .then((response) => {
        setQuizData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du quiz :", error);
        setLoading(false);
      });
  }, [languageId, stageId]);

  // Render loading state
  if (loading) return <div>Chargement du quiz...</div>;

  // Authentication check
  if (!isAuthenticated) return <div>Vous devez être connecté pour jouer.</div>;

  // Handle missing quiz data
  if (!quizData) return <div>Aucune donnée de quiz disponible.</div>;

  // Render the correct quiz component based on the quiz type
  const renderQuizComponent = () => {
    switch (quizData.type) {
      case "multiple":
        return (
          <MultipleChoiceQuiz
            questions={{
              question: quizData.question,
              options: quizData.options!,
              answer: quizData.answer!,
            }}
          />
        );
      case "true_false":
        return (
          <TrueFalseQuiz
            questions={[
              { statement: quizData.question, isTrue: quizData.isTrue! },
            ]}
          />
        );
      case "order":
        return (
          <SentenceOrderQuiz
            sentence={quizData.correctOrder!.join(" ")}
            scrambled={quizData.scrambledSentence!}
            language={languageId === "2" ? "fr" : "en"}
          />
        );
      default:
        return <div>Type de quiz inconnu.</div>;
    }
  };

  return (
    <div className={`${containerStyles.fullWidthCenter} p-4`}>
      <div className={`${containerStyles.card}`}>
        <h1 className={`${typographyStyles.heading1} text-center mb-8`}>
          {quizData.title}
        </h1>
        {renderQuizComponent()}
      </div>
    </div>
  );
};

export default Play;
