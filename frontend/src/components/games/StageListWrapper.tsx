import React from 'react';
import { useRouter } from 'next/router';
import LessonsStages from './LessonsStages';


const StageListWrapper: React.FC = () => {
  const router = useRouter();
  const { languageId } = router.query;
// Importing Components
  if (!languageId || Array.isArray(languageId)) {
    return <div>Error: Invalid Language ID</div>;
  }

  return <LessonsStages languageId={parseInt(languageId, 10)} />;
};

export default StageListWrapper;

