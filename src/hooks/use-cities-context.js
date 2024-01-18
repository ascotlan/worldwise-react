import { useContext } from "react";
import { CitiesContext } from "../context/cities";

function useCitiesContext(){
  const context = useContext(CitiesContext);
  if(context === undefined) throw new Error('CitiesContext being called outside of the CitiesProvider')
  return context;
}

export default useCitiesContext;