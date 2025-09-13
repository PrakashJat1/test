import { createContext, useContext } from "react";

export const LoaderContext = createContext();

const useLoader = () => useContext(LoaderContext);

export default  useLoader;