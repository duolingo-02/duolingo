// ==============================
// Importing React and Router
// ==============================
import React from "react";
import { useParams } from "react-router-dom";

// ==============================
// Importing Components
// ==============================
import StageList from "./LessonsStages";

/**
 * StageListWrapper Component
 *
 * Retrieves languageId from URL params and passes it to StageList.
 */
const StageListWrapper: React.FC = () => {
  const { languageId } = useParams<{ languageId: string }>(); // Extract languageId from URL

  return <StageList languageId={Number(languageId)} />; // Pass languageId as a prop to StageList
};

export default StageListWrapper;
