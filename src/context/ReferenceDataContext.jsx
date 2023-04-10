import { createContext, useState } from "react";

const [unicornTypes, setUnicornTypes] = useState(undefined);

const ReferenceDataContext = createContext({ unicornTypes, setUnicornTypes });

const ReferenceDataContextProvider = ({ children }) => {
  return (
    <ReferenceDataContext.Provider value={{ unicornTypes, setUnicornTypes }}>
      {{...children}}
    </ReferenceDataContext.Provider>
  );
};

export { ReferenceDataContext, ReferenceDataContextProvider };