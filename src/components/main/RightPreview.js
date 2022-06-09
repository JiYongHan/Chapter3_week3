/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : RightPreview.js
  Detail   : Firebase DB에서 가져온 Right layout 데이터를 출력하기 위한 컴포넌트
           : MainPreview 컴포넌트에서 받아온 props 를 요소에 맞게 출력
*/

import React from "react";

// import navigate
import { useNavigate } from "react-router-dom";

// import css
import "../../css/RightPreview.css";

// import icos
import PATH_AVATAR from "../../img_files/icon.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faThumbsUp,
  faComment,
} from "@fortawesome/free-regular-svg-icons";

const RightPreview = ( { LoginUser, data } ) => {
  const LoginID = LoginUser.currentUser?.email;
  const PostID =  data.user_id;
  const navigate = useNavigate();
  console.log( data.id, PostID );
  const listClickEvent = () => {
    if( LoginID === PostID ){
    navigate("/update", { state : { id : data.id, text: data.text_cotent, url : data.img_url } });
    }else{
      window.alert("작성자가 아니여서 수정할 수 없습니다.");
    }
  };
  return (
    <div className="RightPreview-container" onClick={listClickEvent}>
      <div className="RightPreview-top-wrap">
        <div className="RightPreview-top-userinfo">
          <img
            className="RightPreview-top-userinfo-icon"
            src={PATH_AVATAR}
            alt=""
          />
          <div className="RightPreview-top-userinfo-name">{data.user_name}</div>
        </div>
        <div className="RightPreview-top-post-time">{data.timestamp ? data.timestamp : "17 분전"}</div>
      </div>
      <div className="RightPreview-middle-wrap">
        <img className="RightPreview-middle-img" src={data.img_url} alt="" />
        <div className="RightPreview-middle-text">{data.text_cotent}</div>
      </div>
      <div className="RightPreview-bottom-wrap">
        <div className="RightPreview-bottom-Right-icons">
          <FontAwesomeIcon className="RightPreview-bottom-Right-icon-like" icon={faThumbsUp} />
            <span> 0 </span>
          <FontAwesomeIcon icon={faComment} />
            <span> 0 </span>
        </div>
        <FontAwesomeIcon
          className="RightPreview-bottom-heart-icon"
          icon={faHeart}
        />
      </div>
    </div>
  );
};

export default RightPreview;
