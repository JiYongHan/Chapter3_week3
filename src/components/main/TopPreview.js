/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : TopPreview.js
  Detail   : Firebase DB에서 가져온 Top layout 데이터를 출력하기 위한 컴포넌트
           : MainPreview 컴포넌트에서 받아온 props 를 요소에 맞게 출력
*/

import React from "react";

// import css
import "../../css/TopPreview.css";

// import icos
import PATH_AVATAR from "../../img_files/icon.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faThumbsUp,
  faComment,
} from "@fortawesome/free-regular-svg-icons";

// import navigate
import { useNavigate } from "react-router-dom";

const TopPreview = ( { LoginUser, data }) => {
  const LoginID = LoginUser.currentUser?.email;
  const PostID =  data.user_id;
  const navigate = useNavigate();
  const listClickEvent = () => {
    if( LoginID === PostID ){
      navigate("/update", { state : { id : data.id, text: data.text_cotent, url : data.img_url } });
    }else{
      window.alert("작성자가 아니여서 수정할 수 없습니다.");
    }
  };
  
  return (
    <div className="TopPreview-container" onClick={listClickEvent}>
      <div className="TopPreview-top-wrap">
        <div className="TopPreview-top-userinfo">
          <img
            className="TopPreview-top-userinfo-icon"
            src={PATH_AVATAR}
            alt=""
          />
          <div className="TopPreview-top-userinfo-name">{data.user_name}</div>
        </div>
        <div className="TopPreview-top-post-time">{data.timestamp ? data.timestamp : "17 분전"}</div>
      </div>
      <div className="TopPreview-middle-wrap">
        <div className="TopPreview-middle-text">{ data.text_cotent }</div>
        <img className="TopPreview-middle-img" src={ data.img_url } alt="" />
      </div>
      <div className="TopPreview-bottom-wrap">
        <div className="TopPreview-bottom-Top-icons">
          <FontAwesomeIcon
            className="TopPreview-bottom-Top-icon-like"
            icon={faThumbsUp}
          />
          <span> 0 </span>
          <FontAwesomeIcon icon={faComment} />
          <span> 0 </span>
        </div>
        <FontAwesomeIcon
          className="TopPreview-bottom-heart-icon"
          icon={faHeart}
        />
      </div>
    </div>
  );
};

export default TopPreview;
