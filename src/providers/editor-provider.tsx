'use client';
import React, {createContext, useContext, useState} from 'react';

const EditorContext = createContext([null, _ => {}]);

export const EditorProvider = ({children}: {children: React.ReactNode}) => {
  const [type, setType] = useState(null);

  return (
    <EditorContext.Provider value={[type, setType]}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor Hook must be used within the editor Provider');
  }
  return context;
};
