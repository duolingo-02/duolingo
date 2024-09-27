import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LockedIcon } from "../../assets/icons/closed.svg"; // Icône de stage verrouillé
import { useDecodeToken } from "../../hooks/useDecode"; // Décode le token utilisateur
import { containerStyles, typographyStyles } from "../../styles/styles";
import { Lesson } from "../../types/Game";

// ==============================
// Composant StageSelection
// ==============================
const StageSelection: React.FC<{ languageId: number }> = ({ languageId }) => {
  // États pour les leçons, la progression et l'état de chargement
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const decodedToken = useDecodeToken();
  const userId = decodedToken ? decodedToken.id : null;

  // ==============================
  // Récupérer les leçons et la progression à la montée du composant
  // ==============================
  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token manquant");
        return;
      }
      try {
        // Récupérer les leçons disponibles pour la langue choisie
        const lessonResponse = await axios.get(
          `http://localhost:1274/api/lessons/language/${languageId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const lessonsData = lessonResponse.data;

        // Récupérer la progression de l'utilisateur dans les leçons
        const progressResponse = await axios.get(
          `http://localhost:1274/api/lessons/user/${userId}/language/${languageId}/progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressData = progressResponse.data;

        // Trier les leçons en mettant les complétées en premier
        const sortedLessons = sortLessonsByCompletion(
          lessonsData,
          progressData
        );

        setLessons(sortedLessons); // Stocker les leçons triées
        setProgressData(progressData); // Stocker les données de progression
        setLoading(false); // Désactiver l'état de chargement après la récupération
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false); // Désactiver l'état de chargement en cas d'erreur
      }
    };

    if (userId) {
      fetchLessonsAndProgress(); // Récupérer les données lorsque l'utilisateur est identifié
    }
  }, [languageId, userId]);

  // ==============================
  // Fonction pour trier les leçons : complétées d'abord
  // ==============================
  const sortLessonsByCompletion = (lessons: Lesson[], progressData: any[]) => {
    return lessons.sort((a, b) => {
      const progressA = progressData.find((p) => p.lessonId === a.id);
      const progressB = progressData.find((p) => p.lessonId === b.id);

      const completedA = progressA?.isCompleted || false;
      const completedB = progressB?.isCompleted || false;

      // Les leçons complétées viennent avant celles non complétées
      if (completedA && !completedB) return -1;
      if (!completedA && completedB) return 1;

      // Si les deux sont complétées ou non, conserver l'ordre initial
      return 0;
    });
  };

  // ==============================
  // Naviguer vers le stage sélectionné
  // ==============================
  const handleStageClick = (stageId: number) => {
    navigate(`/language/${languageId}/stages/${stageId}/play`);
  };

  // ==============================
  // Obtenir la progression d'un stage
  // ==============================
  const getStageProgress = (lessonId: number) => {
    const stageProgress = progressData.find(
      (progress) => progress.lessonId === lessonId
    );
    if (!stageProgress) return { isCompleted: false, progress: 0 }; // Retourner les valeurs par défaut si aucune progression n'est trouvée
    return stageProgress; // Retourner la progression trouvée
  };

  // ==============================
  // Vérifier si un stage est débloqué
  // ==============================
  const isStageUnlocked = (lessonId: number, index: number) => {
    if (index === 0) return true; // Le premier stage est toujours déverrouillé
    const previousLessonId = lessons[index - 1]?.id;
    const previousLessonProgress = progressData.find(
      (progress) => progress.lessonId === previousLessonId
    );
    return previousLessonProgress && previousLessonProgress.isCompleted; // Le stage est débloqué si le précédent est complété
  };

  // ==============================
  // Affichage du composant pendant le chargement
  // ==============================
  if (loading) {
    return (
      <div className="text-center text-duolingoLight">
        Chargement des stages...
      </div>
    );
  }

  // ==============================
  // Rendu du composant de sélection des stages
  // ==============================
  return (
    <div className={`${containerStyles.fullWidthCenter} p-4`}>
      <div className={containerStyles.card}>
        <h1 className={`${typographyStyles.heading1} text-center`}>
          Select a Level
        </h1>

        <div className="grid grid-cols-2 gap-8 mt-8 md:grid-cols-4">
          {lessons.map((lesson, index) => {
            const { isCompleted, progress } = getStageProgress(lesson.id); // Obtenir la progression de l'étape
            const isUnlocked = isStageUnlocked(lesson.id, index); // Vérifier si le stage est débloqué

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
                onClick={() => isUnlocked && handleStageClick(lesson.id)} // Naviguer si le stage est débloqué
              >
                {isCompleted ? (
                  <span className="text-2xl font-bold">✅</span> // Icône de stage complété
                ) : isUnlocked ? (
                  <span className="text-2xl font-bold">{index + 1}</span> // Afficher le numéro de stage
                ) : (
                  <LockedIcon className="h-16 " /> // Icône de stage verrouillé
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StageSelection;
