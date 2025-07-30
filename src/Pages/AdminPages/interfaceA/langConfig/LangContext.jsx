import React, { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext();

export const LangProvider = ({ children }) => {
    const [lang, setLang] = useState(null); // boshlang'ich null
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem("lang") || "UZ";
        setLang(savedLang);
        setIsReady(true);
    }, []);

    return (
        <LangContext.Provider value={{ lang, setLang, isReady }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);
