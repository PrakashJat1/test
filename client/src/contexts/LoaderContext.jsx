import { LoaderContext } from '@/hooks/useLoader';
import React, { useState } from 'react'

export const LoaderProvider = ({children}) => {

    const [loading, setLoading] = useState();
  return (
    <LoaderContext.Provider value={{loading,setLoading}}>
        {children}
    </LoaderContext.Provider>
  )
};

