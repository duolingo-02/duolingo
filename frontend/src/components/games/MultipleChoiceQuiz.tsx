import React, { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi";

import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  decrementLives,
  incrementEnergy,
  incrementProgressPercentage,
} from "../../redux/actions/gameActions";
import { useDecodeToken } from "../../hooks/useDecode";
import {
  buttonStyles,
  containerStyles,
  typographyStyles,
} from "../../styles/styles";

interface QuizProps {
  questions: {
    question: string;
    options: string[];
    answer: string;
  };
}

const MultipleChoiceQuiz: React.FC<QuizProps> = ({ questions }) => {

  const router = useRouter();
const { languageId, stageId } = router.query;


  const decodedToken = useDecodeToken();
  const userId = decodedToken ? decodedToken.id : null;

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showPopup, setShowPopup] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setAvailableWords(questions.options);
  }, [questions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && showPopup === null) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimeUp(true);
            setShowPopup("lost");
            dispatch(decrementLives());
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, showPopup, dispatch]);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
  };

  const handleValidate = async () => {
    if (selectedWord === questions.answer) {
      setIsCorrect(true);
      setShowPopup("won");
      dispatch(incrementEnergy(10));
      dispatch(incrementProgressPercentage(5));

      if (userId && stageId) {
        try {
          const response = await fetch('/api/lessonsUsers/post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              lessonId: Number(stageId),
              progress: 100,
              isCompleted: true,
            }),
          });
          if (!response.ok) {
            throw new Error('Failed to save progress');
          }
          console.log("Progress saved successfully");
        } catch (error) {
          console.error("Error saving progress: ", error);
        }
      }
    } else {
      setIsCorrect(false);
      setIncorrectCount((prev) => prev + 1);
      dispatch(decrementLives());
    }
  };

  const handleTextToSpeech = async () => {
    try {
      const response = await fetch('/api/sound/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: questions.question }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      const data = await response.json();
      const audio = new Audio(data.url);
      audio.play();
    } catch (error) {
      console.error("Error fetching text-to-speech audio:", error);
    }
  };

  const progressBarWidth = (timeLeft / 15) * 100;

  const handleNextStage = () => {
    const nextStageId = Number(stageId) + 1;
    router.push(`/language/${languageId}/stages/${nextStageId}/play`);
  };
  
  const handleBack = () => {
    router.back();
  };

  const resetQuiz = () => {
    setShowPopup(null);
    setTimeLeft(15);
    setIsTimeUp(false);
    setSelectedWord(null);
    setIsCorrect(null);
    setIncorrectCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-2.5 my-4">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>

      <div className="mb-4 text-lg">{timeLeft} seconds remaining.</div>

      <div className={`${containerStyles.card} flex flex-col items-center`}>
        <div className="flex items-center mb-4">
          <h2 className={`${typographyStyles.heading2} mr-4`}>
            {questions.question}
          </h2>
          <button
            className="p-2 rounded-full text-duolingoBlue"
            onClick={handleTextToSpeech}
          >
            <FiVolume2 className="text-2xl" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full py-2 mb-6 text-center border-b-2 border-gray-500">
            {selectedWord ? selectedWord : "Click on a word to answer"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {availableWords.map((word, index) => (
            <button
              key={index}
              className={`${buttonStyles.option} px-4 py-2 ${
                selectedWord === word ? "bg-green-500" : ""
              }`}
              onClick={() => handleWordClick(word)}
              disabled={isTimeUp || showPopup !== null}
            >
              {word}
            </button>
          ))}
        </div>

        {isTimeUp ? (
          <div className="mb-4 text-lg font-semibold text-red-500">
            Time's up! You lost.
          </div>
        ) : (
          <>
            {isCorrect !== null && (
              <div
                className={`text-lg font-semibold mb-4 ${
                  isCorrect ? "text-green-500" : "text-red-500"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect, try again."}
              </div>
            )}

            <div className="flex justify-between w-full mt-6">
              <button
                className={`${buttonStyles.secondary} px-6 py-2`}
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className={`${buttonStyles.primary} px-6 py-2`}
                onClick={handleValidate}
                disabled={!selectedWord || isTimeUp || showPopup !== null}
              >
                Validate
              </button>
            </div>
          </>
        )}
      </div>

      {showPopup === "won" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-500">
              Congratulations!
            </h2>
            <p>You answered correctly!</p>
            <button
              className={`${buttonStyles.primary} mt-4`}
              onClick={handleNextStage}
            >
              Next Stage
            </button>
          </div>
        </div>
      )}

      {showPopup === "lost" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500">Sorry!</h2>
            <p>You lost. Try again!</p>
            <button
              className={`${buttonStyles.primary} mt-4`}
              onClick={resetQuiz}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuiz;