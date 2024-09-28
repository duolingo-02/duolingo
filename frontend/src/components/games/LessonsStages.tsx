'use client'

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import LockedIcon from "../../assets/icons/closed.svg";
import { useDecodeToken } from "../../hooks/useDecode";
import { containerStyles, typographyStyles } from "../../styles/styles";
import { Lesson } from "../../types/Game";

const LessonsStages: React.FC<{ languageId: number }> = ({ languageId }) => {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const decodedToken = useDecodeToken();
  const userId = decodedToken?.userId;

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token manquant");
        setLoading(false);
        return;
      }
      try {
        console.log('Fetching lessons and progress', { languageId, userId });
        const lessonResponse = await axios.get(
          `/api/lessons/language/${languageId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const lessonsData = lessonResponse.data;
        console.log('Lessons data received', lessonsData);

        const progressResponse = await axios.get(
          `/api/lessons/user/${userId}/language/${languageId}/progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressData = progressResponse.data;
        console.log('Progress data received', progressData);

        const sortedLessons = sortLessonsByCompletion(
          lessonsData,
          progressData
        );
        setLessons(sortedLessons);
        setProgressData(progressData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Erreur lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    if (userId && languageId) {
      fetchLessonsAndProgress();
    } else {
      setLoading(false);
    }
  }, [languageId, userId]);

  const sortLessonsByCompletion = (lessons: Lesson[], progressData: any[]) => {
    return lessons.sort((a, b) => {
      const progressA = progressData.find((p) => p.lessonId === a.id);
      const progressB = progressData.find((p) => p.lessonId === b.id);

      const completedA = progressA?.isCompleted || false;
      const completedB = progressB?.isCompleted || false;

      if (completedA && !completedB) return -1;
      if (!completedA && completedB) return 1;

      return 0;
    });
  };

  const handleStageClick = (stageId: number) => {
    router.push(`/language/${languageId}/stages/${stageId}/play`);
  };

  const getStageProgress = (lessonId: number) => {
    if (progressData.length === 0) return { isCompleted: false, progress: 0 };
    const stageProgress = progressData.find(
      (progress) => progress.lessonId === lessonId
    );
    return stageProgress || { isCompleted: false, progress: 0 };
  };

  const isStageUnlocked = (index: number) => {
    if (index === 0) return true;
    if (progressData.length === 0) return index === 0;
    const previousLessonId = lessons[index - 1]?.id;
    const previousLessonProgress = progressData.find(
      (progress) => progress.lessonId === previousLessonId
    );
    return previousLessonProgress?.isCompleted || false;
  };

  if (loading) {
    return (
      <div className="text-center text-duolingoLight">
        Chargement des stages...
      </div>
    );
  }

  return (
    <div className={`${containerStyles.fullWidthCenter} p-4`}>
      <div className={containerStyles.card}>
        <h1 className={`${typographyStyles.heading1} text-center`}>
          Select a Level
        </h1>

        <div className="grid grid-cols-2 gap-8 mt-8 md:grid-cols-4">
          {lessons.map((lesson, index) => {
            const { isCompleted, progress } = getStageProgress(lesson.id);
            const isUnlocked = isStageUnlocked(index);

            return (
              <div
                key={lesson.id}
                className={`relative w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  isUnlocked
                    ? "bg-duolingoGreen text-duolingoLight hover:bg-green-600 shadow-lg"
                    : "bg-duolingoGray text-duolingoDark"
                } transform transition-transform duration-200 ${
                  isUnlocked
                    ? "hover:scale-110 cursor-pointer"
                    : "opacity-70 hover:scale-105 cursor-not-allowed hover:opacity-50 "
                }`}
                onClick={() => isUnlocked && handleStageClick(lesson.id)}
              >
                {isCompleted ? (
                  <span className="text-2xl font-bold">✅</span>
                ) : isUnlocked ? (
                  <span className="text-2xl font-bold">{index + 1}</span>
                ) : (
                  <LockedIcon className="h-16 " />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonsStages;