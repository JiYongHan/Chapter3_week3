/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : App.js
  Detail   : 각 컴포넌트들을 가져와서 Router 연결 및 useEffect를 사용한 Firebase DB 읽어오기
        MainHeader componet     ( Card.js )     : 회원가입, 로그인, 홈 아이콘 관리 컴포넌트
        MainPreview componet ( CardEdit.js )    : 게시글이 선택에 따라 호출된 컴포넌트를 관리
        Signup componet ( CardEdit.js )         : 회원 가입
        Login componet                          : 로그인
        Post componet                           : 게시글 등록
        UpdatePost componet                     : 게시글 수정, 삭제 컴포넌트
        PostSlice.js                            : Redux toolkit, Update, Add, Delete를 관리

  * 수정이 필요한 부분
  : 개인 프로젝트라도 Git으로 관리하는 습관을 기를 것
  : 컴포넌트를 효율적으로 나누기 구상
  : css 공부
  : 게시물을 생성하자마자 삭제하면 state에서는 제거되지만 DB에 바로 반영이 안됨, 
    DB 설계상 MainPreview에서 잘못된 컴포넌트가 불려 생긴 현상으로 보임
  : firebase의 timestamp 내장 함수를 활용하지 못함, Date 값을 정형화 하여 넘김
  : 회원 가입시 createUserWithEmailAndPassword 호출되어 onAuthStateChanged 함수의 auth 상태가 바로 변경되는데,
    로그인 활성화를 위해서 가입하지마자 signOut으로 로그아웃을 호출해 auth 상태를 변경시킴
    리덕스를 활용해서 로그인 상태를 관리할 수 있도록 할 것
  : 회원가입 및 로그인 때, 함수에서 반환해주는 에러 코드를 통해 예외처리가 부족한 점
  : uesState를 통해 state flow 에 대한 이해도 높이기
*/

import React from "react";
import "./App.css";

// import Authentication
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// import Router
import { Routes, Route, useNavigate } from "react-router-dom";

// import fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

// import Redux-toolkit
// import { getPostList } from "./redux/modules/PostSlice";
// import { useSelector, useDispatch } from "react-redux";

// import proejct components
import MainHeader from "./components/main/MainHeader";
import MainPreview from "./components/main/MainPreview";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Post from "./components/post/Post";
import UpdatePost from "./components/post/UpdatePost";

// Add package
/*
  firebase
  redux-toolkit
  react-router-dom
  material-ui
  material-icons
*/
/*
id: admin@naver.com
pw: wldyd583

id : test@test.com
pw : wldyd583
*/

function App() {
  const navigate = useNavigate();

  const [ FlagLogin, setIsLogin ] = React.useState(false);
  const [ Usermail, setUsermail ] = React.useState(null);
   
  const loginChecked = ( user ) => {   
    if( user ){
      setIsLogin( true );
      setUsermail( user.email );
    }else{
      setIsLogin( false );
      setUsermail("");
    }
  };
  
  React.useEffect( () => {
    onAuthStateChanged( auth, loginChecked );
    // dispatch( getPostList() );
  }, []); 

  return (
    <div className="App">
      <MainHeader isLogin={FlagLogin} Usermail={Usermail}/>
      <Routes>
        {/* <Route path="/" element={ <MainPreview Lists={ reducerState } /> } /> */}
        <Route path="/" element={ <MainPreview Login_user={auth}/> } />
        <Route path="/signup" element={ <Signup/> } />
        <Route path="/login" element={ <Login/> } />
        <Route path="/post" element={ <Post props={auth}/> } />
        <Route path="/update" element={ <UpdatePost props={auth}/> } />
      </Routes>
      <FontAwesomeIcon className="app-post-icon" style={{ visibility: FlagLogin ? "visible" : "hidden"}} icon={faPenToSquare} onClick={()=>{ navigate("/post") } }/>
    </div>
  );
}

export default App;
