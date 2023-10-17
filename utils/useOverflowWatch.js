import { useState, useRef, useEffect } from "react";

const useOverflowWatch = ()=>{
const [hasVerticalOverflow, setHasVerticalOverflow] = useState(false);
  const overflowingText = useRef(null);

  const checkOverflow = (textContainer) => {
    if (textContainer)
      return (
        textContainer.offsetHeight < textContainer.scrollHeight 
      );
    return false;
  };

  useEffect(() => {
    if (checkOverflow(overflowingText.current)) {
        return setHasVerticalOverflow(true);
    }

    setHasVerticalOverflow(false);
    }, [overflowingText]);


  return {
    overflowingText, 
    hasVerticalOverflow
  }
}
export default useOverflowWatch; 