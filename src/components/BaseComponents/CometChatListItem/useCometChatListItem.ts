import { MouseEvent, useCallback, useState } from "react"

export const useCometChatListItem = ({
  id = "",
  onListItemClicked = ({ id: string = "" }) => { }
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  /* 
      This function is triggered on list item click. 
      It triggers the callback function with the id as input. 
  */
  const listItemClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event && event?.stopPropagation) {
      event.stopPropagation();
    }
    onListItemClicked({ id: id });
  };

  const showTail = () => {
    setIsHovering(true);
  };

  const hideTail = () => {
    setIsHovering(false);
  };

  return {
    listItemClick,
    isHovering,
    showTail,
    hideTail
  }
}