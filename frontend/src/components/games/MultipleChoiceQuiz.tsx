import React, { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
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
  language: string;
}

const MultipleChoiceQuiz: React.FC<QuizProps> = ({ questions, language }) => {
  const router = useRouter();
  const { languageId, stageId } = router.query;
  const dispatch = useDispatch();
  const decodedToken = useDecodeToken();
  const userId = decodedToken?.userId;

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showPopup, setShowPopup] = useState<"won" | "lost" | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && showPopup === null) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showPopup]);

  const handleTimeout = () => {
    setIsTimeUp(true);
    setSelectedWord(null);
    setShowPopup("lost");
    dispatch(decrementLives());
  };

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
  };

  const handleValidate = async () => {
    if (selectedWord === questions.answer) {
      setIsCorrect(true);
      setShowPopup("won");
      dispatch(incrementEnergy(10));
      dispatch(incrementProgressPercentage(5));
      await saveProgress();
    } else {
      setIsCorrect(false);
      setShowPopup("lost");
      dispatch(decrementLives());
    }
  };

  const saveProgress = async () => {
    if (userId && stageId) {
      try {
        await axios.post(`/api/lessonsUsers/post`, {
          userId,
          lessonId: Number(stageId),
          progress: 100,
          isCompleted: true,
        });
        console.log("Progress saved successfully");
      } catch (error) {
        console.error("Error saving progress: ", error);
      }
    }
  };

  const handleTextToSpeech = async () => {
    try {
      const response = await axios.post("/api/sound/text-to-speech", {
        text: questions.question,
        language: language,
      });
      const { url } = response.data;
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error fetching text-to-speech audio:", error);
    }
  };

  const handleNextStage = async () => {
    const nextStageId = Number(stageId) + 1;
    try {
      const response = await axios.get(`/api/lessons/${nextStageId}/language/${languageId}`);
      if (response.status === 200) {
        router.push(`/language/${languageId}/stages/${nextStageId}/play`);
      } else {
        console.log('No more levels available');
        router.push(`/language/${languageId}/stages`);
      }
    } catch (error) {
      console.error("Error checking next stage:", error);
      router.push(`/language/${languageId}/stages`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const resetQuiz = () => {
    setSelectedWord(null);
    setIsCorrect(null);
    setTimeLeft(15);
    setIsTimeUp(false);
    setShowPopup(null);
  };

  const progressBarWidth = (timeLeft / 15) * 100;

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

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {questions.options.map((word, index) => (
            <button
              key={index}
              className={`${buttonStyles.option} ${
                selectedWord === word ? 'bg-duolingoBlue text-white' : ''
              }`}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </button>
          ))}
        </div>

        <button
          className={`${buttonStyles.primary} px-6 py-2`}
          onClick={handleValidate}
          disabled={!selectedWord || isTimeUp || showPopup !== null}
        >
          Validate
        </button>

        {isCorrect !== null && (
          <p className={`mt-4 text-lg ${isCorrect ? "text-green-500" : "text-red-500"}`}>
            {isCorrect ? "Correct!" : "Incorrect, try again."}
          </p>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-500">
              {showPopup === "won" ? "Congratulations!" : "Sorry!"}
            </h2>
            <p>{showPopup === "won" ? "You won!" : "You lost."}</p>
            <button
              className={`${buttonStyles.primary} mt-4`}
              onClick={showPopup === "won" ? handleNextStage : resetQuiz}
            >
              {showPopup === "won" ? "Next Stage" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between w-full mt-6">
        <button
          className={`${buttonStyles.secondary} px-6 py-2`}
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceQuiz;