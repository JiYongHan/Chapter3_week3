import React from "react";

// import Authentication
import { auth, db } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { getDocs, collection, query, where, limit } from "firebase/firestore";

// import Router
import { useNavigate } from "react-router-dom";

// import css
import "../../css/MainHeader.css";

// import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faUserPlus,
  faArrowRightToBracket,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
// import custom
import PATH_AVATAR from "../../img_files/icon.jpg";

const THUMNAIL_AVATAR = PATH_AVATAR;

const MainHeader = ( { isLogin, Usermail }) => {
  const navigate = useNavigate();
  const [ user_nickname, setNickname ] = React.useState( null );
  // console.log("Header Login state : ", isLogin, Usermail);

  const doLogout = () => {
      signOut( auth );
      navigate("/");
  }
  const getUserNickname = async () => {
    const user_docs = await getDocs( query( collection( db, "auth_users") , where("user_id", "==", Usermail ), limit(1) ));
    let user_list = [];
    user_docs.forEach( (item) => {
        user_list.push( item.data() );
    });
    if( user_list.length > 0 ){
        setNickname( user_list[0].user_name );
    }else{
        setNickname( "" );
    }
  };

  React.useEffect( ()=>{
    if( isLogin ){
        getUserNickname();
    }
  });

  return (
    <div className="MainHeader-wrap">
      <FontAwesomeIcon
        icon={faHouseChimney}
        className="MainHeader-home-icon"
        onClick={() => {
          navigate("/");
        }}
      />
      <div 
      style={{ visibility: isLogin ? "visible" : "hidden"}}
      className="MainHeader-user-info">
        <img src={THUMNAIL_AVATAR} alt="" className="MainHeader-user-icon" />
        <span className="MainHeader-user-nickname">{`${user_nickname} 반갑습니다.`}</span>
      </div>
      <div className="MainHeader-right-buttons">
        <FontAwesomeIcon
          icon={faUserPlus}
          className="MainHeader-signup"
          onClick={() => {
            navigate("/signup");
          }}
        />
        {isLogin ? (
            <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="MainHeader-logout"
            onClick={doLogout}
          />
          
        ) : (
            <FontAwesomeIcon
            icon={faArrowRightToBracket}
            className="MainHeader-login"
            onClick={() => {
              navigate("/login");
            }}
          />
        )}
        {/* <FontAwesomeIcon icon={faArrowRightFromBracket} className="MainHeader-logout"/>
                <FontAwesomeIcon icon={faArrowRightToBracket} className="MainHeader-login" onClick={()=>{navigate("/login")}}/> */}
      </div>
    </div>
  );
};

export default MainHeader;
