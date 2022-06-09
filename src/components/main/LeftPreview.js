/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : LeftPreview.js
  Detail   : Firebase DB에서 가져온 Left layout 데이터를 출력하기 위한 컴포넌트
           : MainPreview 컴포넌트에서 받아온 props 를 요소에 맞게 출력
*/

import React from "react";

// import navigate
import { useNavigate } from "react-router-dom";

// import css
import "../../css/LeftPreview.css";

// import icos
import PATH_AVATAR from "../../img_files/icon.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faThumbsUp,
  faComment,
} from "@fortawesome/free-regular-svg-icons";

const LeftPreview = ({ LoginUser, data }) => {
  const LoginID = LoginUser.currentUser?.email;
  const PostID = data.user_id;
  const navigate = useNavigate();
  const listClickEvent = () => {
    if (LoginID === PostID) {
      navigate("/update", {
        state: { id: data.id, text: data.text_cotent, url: data.img_url },
      });
    } else {
      window.alert("작성자가 아니여서 수정할 수 없습니다.");
    }
  };
  return (
    <div className="LeftPreview-container" onClick={listClickEvent}>
      <div className="LeftPreview-top-wrap">
        <div className="LeftPreview-top-userinfo">
          <img
            className="LeftPreview-top-userinfo-icon"
            src={PATH_AVATAR}
            alt=""
          />
          <div className="LeftPreview-top-userinfo-name">{data.user_name}</div>
        </div>
        <div className="LeftPreview-top-post-time">{data.timestamp ? data.timestamp : "17 분전"}</div>
      </div>
      <div className="LeftPreview-middle-wrap">
        <div className="LeftPreview-middle-text">{data.text_cotent}</div>
        <img className="LeftPreview-middle-img" src={data.img_url} alt="" />
      </div>
      <div className="LeftPreview-bottom-wrap">
        <div className="LeftPreview-bottom-left-icons">
          <FontAwesomeIcon
            className="LeftPreview-bottom-left-icon"
            icon={faThumbsUp}
          />
          <span> 0 </span>
          <FontAwesomeIcon icon={faComment} />
          <span> 0 </span>
        </div>
        <FontAwesomeIcon
          className="LeftPreview-bottom-heart-icon"
          icon={faHeart}
        />
      </div>
    </div>
  );
};

export default LeftPreview;
