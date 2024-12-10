import { useState } from "react";
import cometChatLogo from "../../assets/cometchat_logo.svg";
import cometChatLogoDark from "../../assets/cometchat_logo_dark.svg";
import usIcon from "../../assets/us-icon.svg";
import euIcon from "../../assets/eu-icon.svg";
import inIcon from "../../assets/in-icon.svg";
import { useNavigate } from "react-router-dom";
import "../../styles//CometChatLogin/CometChatAppCredentials.css";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

const CometChatAppCredentials = () => {
  const navigate = useNavigate();
  const isDarkMode = document.querySelector('[data-theme="dark"]') ? true : false;


  const [region, setRegion] = useState("us");
  const [appId, setAppId] = useState("");
  const [authKey, setAuthKey] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    localStorage.setItem("region", region);
    localStorage.setItem("appId", appId);
    localStorage.setItem("authKey", authKey);
    if (appId && region && authKey) {
      const uiKitSettings = new UIKitSettingsBuilder()
        .setAppId(appId)
        .setRegion(region)
        .setAuthKey(authKey)
        .subscribePresenceForAllUsers()
        .build();
        await CometChatUIKit.init(uiKitSettings)
        navigate("/login",{replace: true});
    }
  }

  return (
    <div className='cometchat-credentials__page'>
      <div className='cometchat-credentials__logo'>
        {isDarkMode ? <img src={cometChatLogoDark} alt='' /> : <img src={cometChatLogo} alt='' />}

      </div>
      <div className='cometchat-credentials__container'>
        <div className='cometchat-credentials__header'>

          <div className='cometchat-credentials__title'>App Credentials</div>
        </div>
        <form onSubmit={handleSubmit} className='cometchat-credentials__form'>
          <div className='cometchat-credentials__form-group'>
            <div className='cometchat-credentials__form-label'>Region</div>
            <div
              className='cometchat-credentials__region-wrapper'
            >
              <div
                onClick={() => setRegion("us")}
                className={`cometchat-credentials__region ${region === "us"
                  ? "cometchat-credentials__region-selected"
                  : " "
                  }`}
              >
                <img src={usIcon} alt='' />
                <div className='cometchat-credentials__region-text'>US</div>
              </div>
              <div
                onClick={() => setRegion("eu")}
                className={`cometchat-credentials__region ${region === "eu"
                  ? "cometchat-credentials__region-selected"
                  : " "
                  }`}
              >
                <img src={euIcon} alt='' />
                <div className='cometchat-credentials__region-text'>EU</div>
              </div>
              <div
                onClick={() => setRegion("in")}
                className={`cometchat-credentials__region ${region === "in"
                  ? "cometchat-credentials__region-selected"
                  : " "
                  }`}
              >
                <img src={inIcon} alt='' />
                <div className='cometchat-credentials__region-text'>IN</div>
              </div>
            </div>
          </div>

          <div className='cometchat-credentials__form-group'>
            <label className='cometchat-credentials__form-label' htmlFor='name'>
              APP ID
            </label>
            <input
              className='cometchat-credentials__form-input'
              type='text'
              id='name'
              placeholder='Enter the app ID'
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              required={true}
            />
          </div>

          <div className='cometchat-credentials__form-group'>
            <label className='cometchat-credentials__form-label' htmlFor='uid'>
              Auth Keys
            </label>
            <input
              className='cometchat-credentials__form-input'
              type='text'
              id='uid'
              placeholder='Enter the auth key'
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              required={true}
            />
          </div>

          <button className='cometchat-credentials__button' type='submit'>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CometChatAppCredentials;