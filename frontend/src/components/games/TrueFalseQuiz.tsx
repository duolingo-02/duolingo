// ==============================
// Importing React, Hooks, and Libraries
// ==============================
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi"; // Sound icon
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrementLives } from "../../redux/actions/gameActions";
import { buttonStyles, typographyStyles } from "../../styles/styles"; // Imported styles
import { TrueFalseQuizProps } from "../../types/Game";

const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({ questions }) => {
  // URL Parameters
  const { languageId, stageId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State Management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Timer Management
  useEffect(() => {
    if (timeLeft > 0 && showPopup === null) {
      const timer = setInterval(() => {
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

      return () => clearInterval(timer);
    }
  }, [timeLeft, showPopup, dispatch]);

  // Handle Timeout
  const handleTimeout = () => {
    setIsTimeUp(true);
    setSelectedAnswer(null);
    setFeedbackVisible(true);
    setShowPopup("lost");
  };

  // Handle Answer Submission
  const handleAnswer = (isTrue: boolean) => {
    setSelectedAnswer(isTrue);
    setFeedbackVisible(true);
    if (isTrue === questions[currentQuestion].isTrue) {
      setShowPopup("won");
      saveProgress();
    } else {
      setShowPopup("lost");
    }
  };

  // Save User Progress
  const saveProgress = async () => {
    if (userId && stageId) {
      try {
        await axios.post(`http://localhost:1274/api/lessonsUsers/post`, {
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

  // Handle Text-to-Speech API call
  const handleTextToSpeech = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1274/api/sound/text-to-speech",
        {
          text: questions[currentQuestion].statement,
        }
      );

      const { url } = response.data;
      setAudioUrl(url);

      // Automatically play the audio
      const audio = new Audio(url);
      audio.play();
    } catch (error: any) {
      console.error("Error fetching text-to-speech audio:", error);
    }
  };

  // Move to the Next Question or Stage
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      resetQuizState();
    } else {
      handleNextStage();
    }
  };

  // Reset Quiz State for New Question
  const resetQuizState = () => {
    setSelectedAnswer(null);
    setFeedbackVisible(false);
    setTimeLeft(15);
    setIsTimeUp(false);
    setShowPopup(null);
  };

  // Navigate to the Next Stage
  const handleNextStage = () => {
    const nextStageId = Number(stageId) + 1;
    navigate(`/language/${languageId}/stages/${nextStageId}/play`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Progress Bar
  const progressBarWidth = (timeLeft / 15) * 100;

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {/* Progress Bar */}
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-2.5 my-4">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>

      <div className="mb-4 text-lg">{timeLeft} seconds remaining</div>

      {/* Question Statement with Sound Icon */}
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

      {/* True/False Buttons */}
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

      {/* Display feedback */}
      {feedbackVisible && (
        <p className="mb-4">
          {selectedAnswer === questions[currentQuestion].isTrue
            ? "Correct!"
            : "Incorrect!"}
        </p>
      )}

      {isTimeUp && <p>Time's up! You lost.</p>}

      {/* Popup for Results */}
      {showPopup && (
        <div
          className={`popup ${
            showPopup === "won" ? "won" : "lost"
          } fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
        >
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

      {/* Back/Next Buttons */}
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
