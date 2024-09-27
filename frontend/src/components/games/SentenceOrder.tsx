// ==============================
// Importing React, Hooks, and Libraries
// ==============================
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiVolume2 } from "react-icons/fi"; // Sound icon
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDecodeToken } from "../../hooks/useDecode";
import { decrementLives } from "../../redux/actions/gameActions";
import {
  buttonStyles,
  containerStyles,
  typographyStyles,
} from "../../styles/styles";
import { SentenceOrderProps } from "../../types/Game";

// Utility function to shuffle an array of words
const shuffleArray = (array: string[]) => {
  return array
    .map((word) => ({ word, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ word }) => word);
};

const SentenceOrderQuiz: React.FC<SentenceOrderProps> = ({
  sentence,
  scrambled,
  language,
}) => {
  // URL parameters and navigation
  const { stageId, languageId } = useParams(); // Get the stage and language ID from the URL
  const navigate = useNavigate(); // For navigating between stages

  const decodedToken = useDecodeToken();
  const userId = decodedToken ? decodedToken.id : null; // Get user ID from the decoded token

  const dispatch = useDispatch(); // To dispatch actions like decrementing lives

  // State management
  const [sentenceOrder, setSentenceOrder] = useState<string[]>([]); // To keep track of the selected words in order
  const [availableWords, setAvailableWords] = useState<string[]>([]); // The words available for selection
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Track if the sentence is correct
  const [timeLeft, setTimeLeft] = useState(15); // Timer for the quiz
  const [isTimeUp, setIsTimeUp] = useState(false); // Flag for when time is up
  const [showPopup, setShowPopup] = useState<string | null>(null); // To show win/loss popups
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // URL for the audio file (text-to-speech)

  // Shuffle words on component mount
  useEffect(() => {
    setAvailableWords(shuffleArray(scrambled));
  }, [scrambled]);

  // Timer effect
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

      return () => clearInterval(timer); // Clear the interval when unmounted
    }
  }, [timeLeft, showPopup, dispatch]);

  // Handle word selection and sentence formation
  const handleWordSelection = (word: string) => {
    if (!sentenceOrder.includes(word)) {
      setSentenceOrder([...sentenceOrder, word]);
      setAvailableWords(availableWords.filter((w) => w !== word));
    }
  };

  // Submit the formed sentence for validation
  const handleSubmit = async () => {
    const correctOrder = sentence.split(" ");
    const isCorrectSentence =
      sentenceOrder.join(" ") === correctOrder.join(" ");
    setIsCorrect(isCorrectSentence);

    if (isCorrectSentence) {
      setShowPopup("won");

      // Send progress data to the backend
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
          console.log("Progress saved successfully: ", response.data);
        } catch (error) {
          console.error("Error saving progress: ", error);
        }
      }
    } else {
      setIsCorrect(false);
      dispatch(decrementLives()); // Decrease lives on incorrect answer
      setShowPopup("lost");
      console.log("Incorrect answer.");
    }
  };

  // Handle Text-to-Speech API call
  const handleTextToSpeech = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1274/api/sound/text-to-speech",
        {
          text: sentence, // Use the sentence for text-to-speech
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

  // Reset the quiz state
  const handleReset = () => {
    setSentenceOrder([]);
    setAvailableWords(shuffleArray(scrambled)); // Shuffle the words again on reset
    setIsCorrect(null);
    setTimeLeft(15);
    setIsTimeUp(false);
    setShowPopup(null);
  };

  // Navigate to the next stage
  const handleNextStage = () => {
    const nextStageId = Number(stageId) + 1;
    navigate(`/language/${languageId}/stages/${nextStageId}/play`);
  };

  // Go back to the previous screen
  const handleBack = () => {
    navigate(-1);
  };

  // Calculate the width of the progress bar based on remaining time
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

      {/* Sentence Formation */}
      <div className={`${containerStyles.card} flex flex-col items-center`}>
        <div className="flex items-center mb-4">
          <h2 className={`${typographyStyles.heading2} mr-4`}>
            Reorganize the sentence:
          </h2>
          <button
            className="p-2 rounded-full text-duolingoBlue"
            onClick={handleTextToSpeech}
          >
            <FiVolume2 className="text-2xl" />
          </button>
        </div>

        {/* Selected words forming the sentence */}
        <div className="flex flex-col items-center">
          <div className="w-full py-2 mb-6 text-center border-b-2 border-gray-500">
            {sentenceOrder.length > 0
              ? sentenceOrder.join(" ")
              : "Click on a word to form a sentence"}
          </div>

          {/* Feedback message after validation */}
          {isCorrect !== null && (
            <div
              className={`text-lg font-semibold mb-4 ${
                isCorrect ? "text-green-500" : "text-red-500"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect, try again."}
            </div>
          )}
        </div>

        {/* Available words for selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {availableWords.map((word, index) => (
            <button
              key={index}
              className={`${buttonStyles.option} px-4 py-2`}
              onClick={() => handleWordSelection(word)}
            >
              {word}
            </button>
          ))}
        </div>

        {/* Back and Validate buttons */}
        <div className="flex justify-between w-full mt-6">
          <button
            className={`${buttonStyles.secondary} px-6 py-2`}
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className={`${buttonStyles.primary} px-6 py-2`}
            onClick={handleSubmit}
            disabled={sentenceOrder.length !== scrambled.length || isTimeUp}
          >
            Validate
          </button>
        </div>
      </div>

      {/* Popup for win scenario */}
      {showPopup === "won" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-green-500">
              Congratulations!
            </h2>
            <p>You correctly reorganized the sentence!</p>
            <button
              className={`${buttonStyles.primary} mt-4`}
              onClick={handleNextStage}
            >
              Next Stage
            </button>
          </div>
        </div>
      )}

      {/* Popup for loss scenario */}
      {showPopup === "lost" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-500">Sorry!</h2>
            <p>You lost. Try again!</p>
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

export default SentenceOrderQuiz;
