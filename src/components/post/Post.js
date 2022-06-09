/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : Post.js
  Detail   : Post button 클릭시, 게시물을 생성할 컴포넌트
          
        function    : 
          radioValueChanged( event )  : radio button 클릭시 해당 value를 가지고오기 위한 함수
          uploadPostClicked()         : 등록하기 버튼 클릭시 동작하는 함수, addPostList를 사용해 redux에서 state를 생성한다.
          uploadImgURL( event )       : input text URL 의 경로를 가져오기 위한 함수                
*/

import React from "react";
import "../../css/Post.css";

// import firebase and redux
import { addPostList } from "../../redux/modules/PostSlice";
import { useDispatch } from "react-redux";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";

// import thumnail img
import PATH_THUMNAIL from "../../img_files/empty_thumnail.jpg";

const THUMNAIL_SRC = PATH_THUMNAIL;

const Post = (props) => {
  const [radioValue, setValue] = React.useState("0");
  const text_ref = React.useRef(null);
  const img_ref = React.useRef(null);
  const file_link_ref = React.useRef(null);
  const [imgState, setImgState] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user_email = props.props.currentUser.email;

  let textArea_value = "";
  let img_path = "";

  const radioValueChanged = (event) => {
    if (event.target.checked) {
      setValue(event.target.value);
    }
  };
  const uploadPostClicked = () => {
    textArea_value = text_ref.current.value;
    if (file_link_ref.current?.url === undefined || textArea_value === "") {
      window.alert("게시물 내용이 다 채워지지 않았습니다.");
    } else {
      img_path = file_link_ref.current.url;
      // console.log("Upload complete ", radioValue );
      dispatch(
        addPostList({ user_email, radioValue, textArea_value, img_path })
      );
      navigate("/");
    }
  };

  const uploadImgURL = async (event) => {
    const uploaded_file = await uploadBytes(
      ref(storage, `images/${event.target.files[0].name}`),
      event.target.files[0]
    );
    // console.log( uploaded_file );
    const file_url = await getDownloadURL(uploaded_file.ref);
    // console.log( file_url );
    file_link_ref.current = { url: file_url };

    setImgState(file_link_ref.current.url);
  };

  return (
    <div className="post-wrap">
      <h1>게시물 작성</h1>
      <div>
        <div className="post-photo-title">사진 Upload : </div>
        <input
          className="post-photo-input"
          type="file"
          ref={img_ref}
          onChange={uploadImgURL}
        />
        <div className="post-photo-preview-title">미리 보기</div>
        {imgState !== null ? (
          <img
            className="post-photo-preview"
            src={file_link_ref.current.url}
            alt=""
          />
        ) : (
          <img className="post-photo-preview" src={THUMNAIL_SRC} alt="" />
        )}
        {/* <img className="post-photo-preview" src={THUMNAIL_SRC} alt="" /> */}
        <div className="post-form-seleted-wrap">
          <div className="post-form-first">
            <div>
              <input
                type="radio"
                id="form-first-selected"
                name="form-selected"
                value="text_left"
                onChange={radioValueChanged}
              ></input>
              <label htmlFor="form-first-selected">
                1.텍스트가 좌측, 이미지가 우
              </label>
            </div>
            <div className="form-first-contents-wrap">
              <div className="post-form-text">Text</div>
              <img className="post-form-img" src={THUMNAIL_SRC} alt="" />
            </div>
          </div>
          <div className="post-form-second">
            <div>
              <input
                type="radio"
                id="form-second-selected"
                name="form-selected"
                value="text_right"
                onChange={radioValueChanged}
              ></input>
              <label htmlFor="form-second-selected">
                2.텍스트가 우측, 이미지가 좌
              </label>
            </div>
            <div className="form-second-contents-wrap">
              <img className="post-form-img" src={THUMNAIL_SRC} alt="" />
              <div className="post-form-text">Text</div>
            </div>
          </div>
          <div className="post-form-third">
            <div>
              <input
                type="radio"
                id="form-third-selected"
                name="form-selected"
                value="text_top"
                onChange={radioValueChanged}
              ></input>
              <label htmlFor="form-third-selected">
                3.텍스트가 상단, 이미지가 하단
              </label>
            </div>
            <div className="form-third-contents-wrap">
              <div className="post-form-third-text">Text</div>
              <img className="post-form-third-img" src={THUMNAIL_SRC} alt="" />
            </div>
          </div>
        </div>
        <div className="post-letter-title">게시물 내용 작성</div>
        <input type="text"
          className="post-letter-input"
          placeholder="여기에 글을 입력하세요."
          ref={text_ref}
        />
      </div>
      <button className="post-button" onClick={uploadPostClicked}>
        게시물 등록
      </button>
    </div>
  );
};

export default Post;
