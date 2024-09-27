// ==============================
// Importing Dependencies and Styles
// ==============================
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaMedal, FaStar, FaTrophy } from "react-icons/fa";
import {
  achievementsStyles,
  buttonStyles,
  containerStyles,
  typographyStyles,
} from "../../styles/styles";

// ==============================
// Interface Definitions
// ==============================

/**
 * DecodedToken Interface
 * Represents the structure of the JWT token after decoding.
 */
interface DecodedToken {
  id: number;
  role: string;
  exp: number;
  iat: number;
}

/**
 * LessonData Interface
 * Represents the user's lesson progress data.
 */
interface LessonData {
  activeLessons: number;
  completedLessons: number;
}

// ==============================
// Achievements Component
// ==============================

/**
 * Achievements Component
 * Displays the user's progress, lesson data, and points, along with achievements.
 */
const Achievements: React.FC = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token to get user information
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
        
        // Fetch lesson data
        const lessonUrl = `http://localhost:1274/api/lessonsUsers/user/${decoded.id}/lessons/count`;
        const pointsUrl = `http://localhost:1274/api/lessonsUsers/user/${decoded.id}/points`;

        // Fetch lesson data
        axios
          .get(lessonUrl)
          .then((response) => setLessonData(response.data))

          .catch((error) =>
            console.error("Error fetching lesson data:", error)
          );

        // Fetch user points data
        axios
          .get(pointsUrl)
          .then((response) => {
            console.log(response.data);
            if (response.data.totalPoints === null) {
              setPoints(0);
            } else {
              setPoints(response.data.totalPoints);
            }
          })
          .catch((error) => console.error("Error fetching points data:", error))
          .finally(() => setLoading(false));
      } catch (err) {
        console.error("Error decoding token:", err);
        setLoading(false);
      }
    } else {
      console.log("No token found in localStorage");
      setLoading(false);
    }
  }, []);

  /**
   * Calculate Progress Percentage
   * Computes the user's lesson completion percentage.
   */
  const calculateProgress = () => {
    if (lessonData) {
      const totalLessons =
        lessonData.activeLessons + lessonData.completedLessons;
      return totalLessons > 0
        ? Math.floor((lessonData.completedLessons / totalLessons) * 100)
        : 0;
    }
    return 0;
  };

  // Check if all achievements are completed
  const isAchievementCompleted =
    lessonData?.activeLessons === lessonData?.completedLessons;

  if (loading) {
    return <div className="text-duolingoLight">Loading...</div>;
  }

  /**
   * Render the achievement level icon based on points
   */
  const renderLevel = () => {
    if (points! >= 1000)
      return <FaTrophy className={achievementsStyles.levelTrophy} />;
    if (points! >= 500)
      return <FaMedal className={achievementsStyles.levelMedal} />;
    return <FaStar className={achievementsStyles.levelStar} />;
  };

  return (
    <div className={`${containerStyles.fullWidthCenter} p-4`}>
      <div className={containerStyles.card}>
        <h2 className={typographyStyles.heading1}>Your Achievements</h2>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Card: Progress */}
          <div className={containerStyles.secondCard}>
            <h3 className={typographyStyles.heading4}>Your Progress</h3>
            <div className={containerStyles.progressContainer}>
              <div className={achievementsStyles.progressCircle}>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#58CC02 ${calculateProgress()}%, #D3D3D3 0%)`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-duolingoDark">
                  {calculateProgress()}%
                </div>
              </div>
            </div>
          </div>

          {/* Card: Lesson Data */}
          <div className={containerStyles.secondCard}>
            <h3 className={typographyStyles.heading4}>Lesson Data</h3>
            <div className="text-lg font-semibold text-center text-duolingoLight md:mt-10">
              <p>Active Lessons: {lessonData?.activeLessons}</p>
              <p>Completed Lessons: {lessonData?.completedLessons}</p>
            </div>
            {isAchievementCompleted && (
              <p className="mt-4 text-lg font-semibold text-center text-duolingoGreen">
                All lessons completed!
              </p>
            )}
          </div>

          {/* Card: Points */}
          <div className={containerStyles.secondCard}>
            <h3 className={typographyStyles.heading4}>Your Points</h3>
            <div className="flex flex-col items-center mb-6 md:mt-10">
              {renderLevel()}
              <p className="mt-4 text-2xl font-bold text-duolingoYellow">
                {points} Points
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {!isAchievementCompleted && (
          <div className="flex justify-center mt-8">
            <button className={buttonStyles.primary}>
              Continue your progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
