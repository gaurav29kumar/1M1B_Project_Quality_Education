import React, { createContext, useState, useContext } from 'react';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  const updateData = (section, newData) => {
    setData(prev => {
        if (!prev) return null;

        if (section === "deep_dive") {
            // SAFETY FIX: Default to empty object if deep_dive is missing
            const currentDeepDive = prev.deep_dive || { summary: "" };
            return { 
                ...prev, 
                deep_dive: { ...currentDeepDive, summary: currentDeepDive.summary + "\n\n" + newData }
            };
        }
        if (section === "assignment") {
            const currentAssignment = prev.assignment || { tasks: [] };
            return { 
                ...prev, 
                assignment: { ...currentAssignment, tasks: [...(currentAssignment.tasks || []), ...newData] }
            };
        }
        // General arrays
        const currentSection = prev[section] || [];
        return { ...prev, [section]: [...currentSection, ...newData] };
    });
  };

  return (
    <StudyContext.Provider value={{ data, setData, updateData, loading, setLoading, videos, setVideos }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);