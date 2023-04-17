import React, { createContext, useContext, useState, ReactElement } from 'react';

interface CodeContextData {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  isEdited: boolean;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setEditCode: (code: string) => void;
}

const CodeContext = createContext<CodeContextData | undefined>(undefined);

interface CodeProviderProps {
  children: React.ReactNode;
}

export const CodeProvider: React.FC<CodeProviderProps> = ({ children }): ReactElement => {
  const [code, setCode] = useState<string>('');
  const [isEdited, setIsEdited] = useState<boolean>(false);
  
  const setEditCode = (code: string) => {
    setCode(code);
    setIsEdited(true);
  }

  const value: CodeContextData = {
    code,
    setCode,
    isEdited,
    setIsEdited,
    setEditCode 
  }

  return (
    <CodeContext.Provider value={value}>
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = (): CodeContextData => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};
