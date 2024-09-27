// ==============================
// Importing External Libraries and Hooks
// ==============================
import axios from "axios"; // For making POST requests
import React, { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi"; // For sound icon
import { useNavigate, useParams } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import {
  decrementLives,
  incrementEnergy,
  incrementProgressPercentage,
} from "../../redux/actions/gameActions";

// Custom Hooks
import { useDecodeToken } from "../../hooks/useDecode";

// Styles
import {
  buttonStyles,
  containerStyles,
  typographyStyles,
} from "../../styles/styles";

// ==============================
// Component Props Interface
// ==============================
interface QuizProps {
  questions: {
    question: string;
    options: string[];
    answer: string;
  };
}

const MultipleChoiceQuiz: React.FC<QuizProps> = ({ questions }) => {
  // URL parameters and navigation
  const { languageId, stageId } = useParams();
  const navigate = useNavigate();
  const decodedToken = useDecodeToken();
  const userId = decodedToken ? decodedToken.id : null; // Get user ID from token

  // ==============================
  // State Management
  // ==============================
  const [selectedWord, setSelectedWord] = useState<string | null>(null); // The selected word
  const [availableWords, setAvailableWords] = useState([...questions.options]); // Available options
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Check if the selected answer is correct
  const [timeLeft, setTimeLeft] = useState(15); // Timer for the quiz
  const [isTimeUp, setIsTimeUp] = useState(false); // Flag for when the time is up
  const [incorrectCount, setIncorrectCount] = useState(0); // Counter for incorrect attempts
  const [showPopup, setShowPopup] = useState<string | null>(null); // Show win/lose popup
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Audio URL for text-to-speech

  const dispatch = useDispatch(); // For dispatching Redux actions

  // ==============================
  // Timer Effect
  // ==============================
  useEffect(() => {
    if (timeLeft > 0 && showPopup === null) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer); // Clear the timer when it reaches zero
            setIsTimeUp(true);
            setShowPopup("lost");
            dispatch(decrementLives()); // Decrement lives
            return 0;
          }
          return prevTime - 1; // Decrease time left
        });
      }, 1000);

      return () => clearInterval(timer); // Clear the interval on unmount
    }
  }, [timeLeft, showPopup, dispatch]);

  // ==============================
  // Handle Word Selection
  // ==============================
  const handleWordClick = (word: string) => {
    if (selectedWord === word) return; // If the same word is clicked, do nothing
    setSelectedWord(word); // Set the clicked word as selected
    if (!selectedWord) {
      setAvailableWords(availableWords.filter((w) => w !== word)); // Remove the selected word from available words
    } else {
      setAvailableWords(
        availableWords.map((w) => (w === word ? selectedWord : w))
      ); // Swap the selected word
    }
  };

  // ==============================
  // Reset Quiz State
  // ==============================
  const handleReset = () => {
    setSelectedWord(null);
    setAvailableWords([...questions.options]); // Reset available words
    setIsCorrect(null);
    setTimeLeft(15); // Reset timer
    setIsTimeUp(false);
    setIncorrectCount(0);
    setShowPopup(null);
  };

  // ==============================
  // Validate Answer
  // ==============================
  const handleValidate = async () => {
    if (selectedWord === questions.answer) {
      setIsCorrect(true);
      dispatch(incrementProgressPercentage(10));
      setShowPopup("won");
      dispatch(incrementEnergy(10));

      // Post progress data if user and stage IDs are available
      if (userId && stageId) {
        try {
          const response = await axios.post(
            `http://localhost:1274/api/lessonsUsers/post`,
            {
              userId,
              lessonId: Number(stageId),
              progress: 100,
              isCompleted: true,
            }
          );
          console.log("Data successfully posted: ", response.data); // <-- Log response
        } catch (error) {
          console.error("Error posting data: ", error); // <-- Log error
        }
      }
    } else {
      setIsCorrect(false);
      setIncorrectCount(incorrectCount + 1);
      dispatch(decrementLives()); // Decrement lives on incorrect answer
    }
  };

  // ==============================
  // Handle Text-to-Speech API Call
  // ==============================
  const handleTextToSpeech = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1274/api/sound/text-to-speech",
        { text: questions.question }
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

  // ==============================
  // Calculate Progress Bar Width Based on Remaining Time
  // ==============================
  const progressBarWidth = (timeLeft / 15) * 100;

  // Navigate to the next stage
  const handleNextStage = () => {
    const nextStageId = Number(stageId) + 1;
    navigate(`/language/${languageId}/stages/${nextStageId}/play`);
  };

  // Go back to the previous screen
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {/* Progress Bar */}
      <div className="w-full max-w-xl bg-gray-700 rounded-full h-2.5 my-4">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>

      <div className="mb-4 text-lg">{timeLeft} seconds remaining.</div>

      {/* Question and Text-to-Speech */}
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

        {/* Selected Word */}
        <div className="flex flex-col items-center">
          <div className="w-full py-2 mb-6 text-center border-b-2 border-gray-500">
            {selectedWord ? selectedWord : "Click on a word to answer"}
          </div>
        </div>

        {/* Available Words */}
        <div className="flex flex-wrap gap-2 mb-6">
          {availableWords.map((word, index) => (
            <button
              key={index}
              className={`${buttonStyles.option} px-4 py-2 ${
                selectedWord === word ? "bg-green-500" : ""
              }`}
              onClick={() => handleWordClick(word)}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Feedback and Action Buttons */}
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
                disabled={!selectedWord || isTimeUp || showPopup === "lost"}
              >
                Validate
              </button>
            </div>
          </>
        )}
      </div>

      {/* Win Popup */}
      {showPopup === "won" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-500">
              Congratulations!
            </h2>
            <p>You won!</p>
            <button
              className={`${buttonStyles.primary} mt-4`}
              onClick={handleNextStage}
            >
              Next Stage
            </button>
          </div>
        </div>
      )}

      {/* Loss Popup */}
      {showPopup === "lost" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500">Sorry!</h2>
            <p>You lost.</p>
            <button
              className={`${buttonStyles.primary} mt-4`}
              onClick={handleReset}
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
