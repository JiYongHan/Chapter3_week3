/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : MainPreview.js
  Detail   : Firebase DB에서 가져온 데이터를 출력하기 위한 컴포넌트
           : useSelector를 통해 Redux에 저장된 state 를 다 가져오기  
           : 가져온 데이터의 page_select에 따라 하위 컴포넌트를 생성
*/

import React from "react";
import "../../css/MainPreview.css";

// import Redux-toolkit
import { getPostList } from "../../redux/modules/PostSlice"
import { useSelector, useDispatch } from "react-redux";

import LeftPreview from "./LeftPreview";
import RightPreview from "./RightPreview";
import TopPreview from "./TopPreview";

const MainPreview = ( { Login_user } ) => {
  const reducerState = useSelector( state => state.Post.list );
  console.log( "Posts ", reducerState );
  const dispatch = useDispatch();

  React.useEffect( () => {
    dispatch(getPostList());
    console.log("Main 컴포넌트 화면");
    return () => {
      console.log("Main 컴포넌트 사라짐");
    }

  }, []);
  return (
    <div className="Preview-wrap">
      {
        reducerState.map( (element, index ) => {
          // console.log( element.page_select );
          return(
            <>
            { element.page_select === "text_right" && (<RightPreview LoginUser={ Login_user } key={element.id} data={element}/>) }
            { element.page_select === "text_left" && (<LeftPreview LoginUser={ Login_user } key={element.id} data={element}/>) }
            { element.page_select === "text_top" && (<TopPreview LoginUser={ Login_user } key={element.id} data={element}/>) }
            </>
          )
        })
      }
    </div>
  );
};

export default MainPreview;
