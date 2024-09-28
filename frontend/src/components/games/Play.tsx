import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { QuizData } from '../../types/Game';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import TrueFalseQuiz from './TrueFalseQuiz';
import SentenceOrderQuiz from './SentenceOrder';

const Play: React.FC = () => {
  const router = useRouter();
  const { languageId, stageId } = router.query;
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchQuizData = async () => {
      if (languageId && stageId) {
        try {
          const response = await fetch(`/api/lessons/${stageId}/language/${languageId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch quiz data');
          }
          const data = await response.json();
          console.log('Quiz data received:', data);
          setQuizData(data);
        } catch (error) {
          console.error("Error fetching quiz data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizData();
  }, [languageId, stageId]);

  if (!languageId || !stageId) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Chargement du quiz...</div>;
  }

  if (!isAuthenticated) {
    return <div>Vous devez être connecté pour jouer.</div>;
  }

  if (!quizData) {
    return <div>Aucune donnée de quiz disponible.</div>;
  }

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
            questions={{
              question: quizData.correctOrder!.join(" "),
              options: quizData.scrambledSentence!,
              answer: quizData.correctOrder!.join(" "),
            }}
            language={languageId === "2" ? "fr" : "en"}
          />
        );
      default:
        return <div>Type de quiz inconnu.</div>;
    }
  };

  return (
    <div>
      <h1>Quiz</h1>
      {renderQuizComponent()}
    </div>
  );
};

export default Play;