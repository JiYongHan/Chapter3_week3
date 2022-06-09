/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : Login.js
  Detail   : 로그인 이미지 클릭시, 로그인할 컴포넌트
          
        function    : 
          idChecked( user_id, regEx )                                 : 정규식을 통해 로그인 id 유효성 검사
          pwChecked( user_pw, regEx )                                 : 정규식을 통해 로그인 pw 유효성 검사
          validateLoginInfo( idCheckFunction, pwCheckFunction )       : id, pw 유효성 검사를 묶어놓은 함수
          LoginMouseFB()                                              : 로그인 버튼 클릭시 동작하는 onClick 함수

*/

import React from "react";

//import Authentication
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import {
  getDocs,
  where,
  query,
  collection,
  // doc,
  // getDoc,
} from "firebase/firestore";

// import Router
import { useNavigate } from "react-router-dom";

// import css
import "../../css/Login.css";

const Login = () => {
  const id_ref = React.useRef(null);
  const pw_ref = React.useRef(null);
  const navigate = useNavigate();
  const [FlagID, SetIdFlag] = React.useState(true);
  const [FlagPW, SetPwFlag] = React.useState(true);
  const [FlagLogin, SetLoginFlag] = React.useState(true);
  const id_regEx =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const pw_regEx = /^[A-Za-z0-9]{8,14}$/;

  const idChecked = (user_id, regEx) => {
    if (regEx.test(user_id)) {
      SetIdFlag(true);
      return true;
    } else {
      SetIdFlag(false);
      return false;
    }
  };

  const pwChecked = (user_pw, regEx) => {
    if (user_pw.length < 8) {
      SetPwFlag(false);
      return false;
    }
    if (regEx.test(user_pw)) {
      SetPwFlag(true);
      return true;
    } else {
      SetPwFlag(false);
      return false;
    }
  };

  const validateLoginInfo = (idCheckFunction, pwCheckFunction) => {
    if (idCheckFunction && pwCheckFunction) {
      SetLoginFlag(true);
      return true;
    } else {
      SetLoginFlag(false);
      return false;
    }
  };

  let user_id = "";
  let user_pw = "";

  const LoginMouseFB = async () => {
    user_id = id_ref.current.value;
    user_pw = pw_ref.current.value;

    validateLoginInfo(
      idChecked(user_id, id_regEx),
      pwChecked(user_pw, pw_regEx)
    );

    if (FlagLogin) {
      const user_docs = await getDocs(
        query(collection(db, "auth_users"), where("user_id", "==", user_id))
      );
      let user_list = [];
      user_docs.forEach((item) => {
        // console.log(item.data());
        user_list.push(item.data());
      });
      let errorCode = "";
      await signInWithEmailAndPassword(auth, user_id, user_pw)
        .catch((err) => {
          errorCode = err.code;
          console.log(err.code, errorCode);
          switch (err.code) {
            case "auth/Invalid-email":
            case "auth/user-disabled":
            case "auth/user-not-found":
            case "auth/too-many-requests":
              console.log(err.message);
              return;
            case "auth/wrong-password":
              console.log(err.message);
              return;
            default:
          }
        })
        .then((user) => {
          if (user) {
            window.alert(`${user_list[0].user_name}님 환영합니다.`);
            // navigate("/");
            window.location.replace("/");
          } else {
            window.alert('회원 정보가 없습니다.');
          }
        });
    }
  };

  const EnterKeyPressFB = async (event) => {
    if (event.key === "Enter") {
    }
  };

  return (
    <div className="login-wrap">
      <h1>로그인</h1>
      <div>
        <div className="login-id">ID : </div>
        <input
          ref={id_ref}
          className="login-id-input"
          type="email"
          onKeyPress={EnterKeyPressFB}
        />
        <div
          style={{ visibility: FlagID ? "hidden" : "visible" }}
          className="login-id-error"
        >
          아이디가 올바르지 않습니다.
        </div>
        <div className="login-password">Password : </div>
        <input
          ref={pw_ref}
          className="login-password-input"
          type="password"
          onKeyPress={EnterKeyPressFB}
        />
        <div
          style={{ visibility: FlagPW ? "hidden" : "visible" }}
          className="login-password-error"
        >
          패스워드 형식이 틀렸습니다.
        </div>
      </div>
      <button className="login-button" onClick={LoginMouseFB}>
        로그인 하기
      </button>
    </div>
  );
};

export default Login;
