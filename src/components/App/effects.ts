import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useEffect } from "react";

interface IEffectsProps {
  setLoggedInUser: React.Dispatch<
    React.SetStateAction<CometChat.User | null | undefined>
  >;
  setIsMobileView: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Effects(props: IEffectsProps) {
  const { setLoggedInUser, setIsMobileView } = props;

  useEffect(() => {
    (async () => {
      try {
        setLoggedInUser(await CometChat.getLoggedinUser());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setLoggedInUser]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) setIsMobileView(true);
      else setIsMobileView(false);
    }
    window.addEventListener("resize", handleResize);
  }, [setIsMobileView]);
}
