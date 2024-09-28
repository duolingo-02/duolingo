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
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchQuizData = async () => {
      if (languageId && stageId) {
        try {
          setLoading(true);
          const response = await fetch(`/api/lessons/${stageId}/language/${languageId}`);
          if (!response.ok) {
            if (response.status === 404) {
              console.log('No more levels available');
              router.push(`/language/${languageId}/stages`);
              return;
            }
            throw new Error('Failed to fetch quiz data');
          }
          const data = await response.json();
          console.log('Quiz data received:', data);
          setQuizData(data);
        } catch (error) {
          console.error("Error fetching quiz data:", error);
          setError("Failed to load quiz. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchQuizData();
  }, [languageId, stageId, router]);

if (!languageId || !stageId) {
  return <div>Loading...</div>;
}

if (loading) {
  return <div>Chargement du quiz...</div>;
}

if (error) {
  return <div>{error}</div>;
}

if (!isAuthenticated) {
  return <div>Vous devez être connecté pour jouer.</div>;
}

if (!quizData) {
  return <div>Aucune donnée de quiz disponible.</div>;
}

const renderQuizComponent = () => {
  const language = languageId === "2" ? "fr" : "en";
  switch (quizData.type.toLowerCase()) {
    case "multiple":
      return (
        <MultipleChoiceQuiz
          questions={{
            question: quizData.question,
            options: quizData.options!,
            answer: quizData.answer!,
          }}
          language={language}
        />
      );
    case "true_false":
      return (
        <TrueFalseQuiz
          questions={[
            { statement: quizData.question, isTrue: quizData.isTrue! },
          ]}
          language={language}
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
          language={language}
        />
        );
      default:
        console.error("Unknown quiz type:", quizData.type);
        return <div>Type de quiz inconnu: {quizData.type}</div>;
    }
  };;

  return (
    <div>
      <h1>Quiz</h1>
      {renderQuizComponent()}
    </div>
  );
};

export default Play;