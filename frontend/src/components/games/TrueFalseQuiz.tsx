import React, { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { decrementLives } from "../../redux/actions/gameActions";
import { buttonStyles, typographyStyles } from "../../styles/styles";
import { TrueFalseQuizProps } from "../../types/Game";
import { useDecodeToken } from "../../hooks/useDecode";




const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({ questions }) => {
  const router = useRouter();
  const { languageId, stageId } = router.query;
  const dispatch = useDispatch();
  const decodedToken = useDecodeToken();
  const userId = decodedToken?.userId;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showPopup, setShowPopup] = useState<"won" | "lost" | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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
    setSelectedAnswer(null);
    setFeedbackVisible(true);
    setShowPopup("lost");
    dispatch(decrementLives());
  };

  const handleAnswer = (isTrue: boolean) => {
    setSelectedAnswer(isTrue);
    setFeedbackVisible(true);
    if (isTrue === questions[currentQuestion].isTrue) {
      setShowPopup("won");
      saveProgress();
    } else {
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
        text: questions[currentQuestion].statement,
      });

      const { url } = response.data;
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error fetching text-to-speech audio:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      resetQuizState();
    } else {
      handleNextStage();
    }
  };

  const resetQuizState = () => {
    setSelectedAnswer(null);
    setFeedbackVisible(false);
    setTimeLeft(15);
    setIsTimeUp(false);
    setShowPopup(null);
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

  const progressBarWidth = (timeLeft / 15) * 100;

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-2.5 my-4">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>

      <div className="mb-4 text-lg">{timeLeft} seconds remaining</div>

      <div className="flex items-center mb-4">
        <h3 className={typographyStyles.heading2}>
          {questions[currentQuestion].statement}
        </h3>
        <button
          className="p-2 rounded-full text-duolingoBlue"
          onClick={handleTextToSpeech}
        >
          <FiVolume2 className="text-2xl" />
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className={buttonStyles.option}
          onClick={() => handleAnswer(true)}
        >
          True
        </button>
        <button
          className={buttonStyles.option}
          onClick={() => handleAnswer(false)}
        >
          False
        </button>
      </div>

      {feedbackVisible && (
        <p className="mb-4">
          {selectedAnswer === questions[currentQuestion].isTrue
            ? "Correct!"
            : "Incorrect!"}
        </p>
      )}

      {isTimeUp && <p>Time's up! You lost.</p>}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-500">
              {showPopup === "won" ? "Congratulations!" : "Sorry!"}
            </h2>
            <p>{showPopup === "won" ? "You won!" : "You lost."}</p>
            <button
              className={`${buttonStyles.primary} mt-4`}
              onClick={showPopup === "won" ? handleNextStage : resetQuizState}
            >
              {showPopup === "won" ? "Next Stage" : "Retry"}
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
        <button
          className={`${buttonStyles.primary} px-6 py-2`}
          onClick={handleNext}
          disabled={selectedAnswer === null && !isTimeUp}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuiz;