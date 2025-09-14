import { createContext, useContext, useState } from "react";
import { FullPageLoader } from "@/components/FullPageLoader";

interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

interface LoaderProviderType {
    children: React.ReactNode
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

const LoaderProvider = ({ children }: LoaderProviderType) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <FullPageLoader />}
    </LoaderContext.Provider>
  );
};

const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used within LoaderProvider");
  return ctx;
};

export {
   LoaderProvider,
   useLoader
}