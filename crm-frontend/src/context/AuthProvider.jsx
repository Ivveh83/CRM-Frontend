import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [activeDbKey, setActiveDbKey] = useState(null);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  {
    /*Detta är global state som håller reda på vilket conversationId som används för vilken chatt-typ.*/
  }
  const [conversationIds, setConversationIds] = useState({
    DEFAULT: null, // ANALYSIS / DECISION / EMAIL
    ACTION: null,
  });

  {
    /*Funktionen säkerställer att det finns ett conversationId för den angivna typen.*/
  }
  const ensureConversationId = (type) => {
    // type = ACTION / DEFAULT
    setConversationIds((prev) => {
      if (prev[type]) return prev; // Om det finns ett värde redan under nyckeln (type), behåll det.
      return { ...prev, [type]: generateId() }; // Annars generera ett nytt värde.
    });
  };

  const resetConversationId = (type) => {
    setConversationIds((prev) => ({
      ...prev,
      [type]: generateId(),
    }));
  };

  const getConversationId = (type) => {
    return conversationIds[type];
  };

  const [messagesByConversation, setMessagesByConversation] = useState({
    DEFAULT: [],
    ACTION: [],
  });

  const getMessages = (type) => messagesByConversation[type];

  const addMessage = (type, message) => {
    setMessagesByConversation((prev) => ({
      ...prev,
      [type]: [...prev[type], message],
    }));
  };

  const clearMessages = (type) => {
    setMessagesByConversation((prev) => ({
      ...prev,
      [type]: [],
    }));
  };

  // 🔹 AI SETTINGS (GLOBALA)
  const [aiSettings, setAiSettings] = useState({
    provider: "openai",
    model: "gpt-4.1-mini",
    temperature: 0.3,
    topP: 0.95,
    maxTokens: 800,
  });

  // 🔹 Hjälpfunktion för uppdatering
  const updateAiSetting = (key, value) => {
    setAiSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        // AUTH
        auth,
        setAuth,
        // DATABASE
        activeDbKey,
        setActiveDbKey,
        // AI MODELSETTINGS
        aiSettings,
        setAiSettings,
        updateAiSetting,
        // AI CHAT CONVERSATIONS
        conversationIds,
        ensureConversationId,
        resetConversationId,
        getConversationId,
        messagesByConversation,
        setMessagesByConversation,
        getMessages,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
