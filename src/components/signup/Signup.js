/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : Signup.js
  Detail   : 회원가입 이미지 클릭시, 회원가입 할 컴포넌트
           : 유효성 검사를 통해 등록할 회원 id, password, nickname을 확인
           : 각 state를 활용해 flag에 따라 div 태그 활성 및 비활성화
          
        function    : 
          checkID( user_id, regEx )                                    : 정규식을 통해 등록할 회원 id 유효성 검사
          checkPassword( user_pw, regEx )                              : 정규식을 통해 등록할 회원 pw 유효성 검사
          checkPasswordAndAgainPassword(user_pw, again_user_pw)        : 입력된 password와 다시 입력된 password의 유효성 검사
          checkNickname( user_nick_name, regEx )                       : 정규식을 통해 nickname이 입력되었는지 안되었는지 유효성 검사
          validateCheck( CheckIdFunctions, CheckNicknameFunction,
                         CheckPwFunction, CheckAgainPwFunction )       : 유효성 검사가 모두 끝났을 때 회원가입 플래그를 활성화하기 위한 ㅎ마수

*/
import React from "react";
import "../../css/Signup.css";

// import Authentication, DB
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

// import Router
// import { useNavigate } from "react-router-dom";

const Signup = () => {
  const id_ref = React.useRef(null);
  const nick_ref = React.useRef(null);
  const pw_ref = React.useRef(null);
  const pw_again_ref = React.useRef(null);
  // const navigate = useNavigate();

  // email 형식 확인 정규식
  // 숫자, 영소문자, 특수문자 후 @ 숫자, 영소문자, 특수문자 후 . 2~3자리 영소문자
  const id_regEx =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  // 영소문자, 숫자, 8 ~ 14자리까지
  const pw_regEx = /^[A-Za-z0-9]{8,14}$/;
  const nick_regEx = /^[0-9a-zA-Z가-힣ㄱ-ㅎ]{2,6}$/;

  let user_id = "";
  let user_nick = "";
  let user_pw = "";
  let user_pw_again = "";

  const [FlagNick, SetNickFlag] = React.useState(true); // nickname 유효성 검사 플래그
  const [FlagID, SetIdFlag] = React.useState(true); // id 유효성 검사 플래그
  const [FlagPW, SetPWFlag] = React.useState(true); // Password 유효성 검사 플래그
  const [FlagPWAgain, SetPWFAgainFlag] = React.useState(true); // Password와 다시 입력된 Password 검사 플래그

  const padZero = (num) => {
    return (num < 10 ? "0" : "") + num;
  };

  const getCurrentTime = () => {
    let now = new Date();
    let result =
      "" +
      now.getFullYear() +
      "/" +
      padZero(now.getMonth() + 1) +
      "/" +
      padZero(now.getDate()) +
      " " +
      padZero(now.getHours()) +
      ":" +
      padZero(now.getMinutes()) +
      ":" +
      padZero(now.getSeconds());
    return result;
  };

  const validateCheck = (
    CheckIdFunctions,
    CheckNicknameFunction,
    CheckPwFunction,
    CheckAgainPwFunction
  ) => {
    if (
      CheckIdFunctions &&
      CheckNicknameFunction &&
      CheckPwFunction &&
      CheckAgainPwFunction
    ) {
      console.log("validate true");
      return true;
    } else {
      console.log("validate false");
      return false;
    }
  };
  // 정규식으로 ID 판별
  const checkID = (user_id, regEx) => {
    if (regEx.test(user_id)) {
      console.log("ID ok");
      SetIdFlag(true);
      // console.log( FlagID);
      return true;
    } else {
      console.log("ID no");
      SetIdFlag(false);
      return false;
    }
  };
  // 정규식으로 Password 판별
  const checkPassword = (user_pw, regEx) => {
    if (regEx.test(user_pw)) {
      console.log("PW ok");
      SetPWFlag(true);
      // console.log( FlagPW);
      return true;
    } else {
      console.log("PW no");
      SetPWFlag(false);
      // console.log( FlagPW);
      return false;
    }
  };
  // 정규식으로 Password와 다시 입력된 Password 판별
  const checkPasswordAndAgainPassword = (user_pw, again_user_pw) => {
    if (user_pw.length < 8 || again_user_pw.length < 8) {
      // console.log("agin len no");
      SetPWFAgainFlag(false);
      // console.log( FlagPWAgain );
      return false;
    }

    if (user_pw !== again_user_pw) {
      console.log("agin pw no");
      SetPWFAgainFlag(false);
      // console.log( FlagPWAgain );
      return false;
    } else {
      console.log("agin pw ok");
      SetPWFAgainFlag(true);
      // console.log( FlagPWAgain );
      return true;
    }
  };

  const checkNickname = (user_nick_name, regEx) => {
    if (regEx.test(user_nick_name)) {
      console.log("nick ok");
      SetNickFlag(true);
      // console.log( FlagNick);
      return true;
    } else {
      console.log("nick no");
      SetNickFlag(false);
      // console.log( FlagNick);
      return false;
    }
  };

  const MouseClickSignupFB = async () => {
    user_id = id_ref.current.value;
    user_nick = nick_ref.current.value;
    user_pw = pw_ref.current.value;
    user_pw_again = pw_again_ref.current.value;

    if (
      validateCheck(
        checkID(user_id, id_regEx),
        checkNickname(user_nick, nick_regEx),
        checkPassword(user_pw, pw_regEx),
        checkPasswordAndAgainPassword(user_pw, user_pw_again)
      )
    ) {
      //  console.log(FlagID, FlagNick, FlagPW, FlagPWAgain, FlagSignUp);

      await createUserWithEmailAndPassword(auth, user_id, user_pw)
        .catch((error) => console.log(error.code))
        .then(async (user) => {
          if (user) {
            await addDoc(collection(db, "auth_users"), {
              user_id: user_id,
              user_name: user_nick,
              timestamp: getCurrentTime(),
            });

            await addDoc(collection(db, "users_info"), {
              user_id: user_id,
              user_name: user_nick,
              timestamp: getCurrentTime(),
            });

            window.alert(`회원가입 완료!`);
            signOut(auth);
            window.location.replace("/login");
          } else {
            window.alert(`이미 가입되어 있습니다.`);
          }
        });
    } else {
      window.alert(`가입 정보를 다시 기입해주세요.`);
    }
  };

  const EnterKeyPreesSignupFB = async (event) => {
    if (event.key === "Enter") {
      user_id = id_ref.current.value;
      user_nick = nick_ref.current.value;
      user_pw = pw_ref.current.value;
      user_pw_again = pw_again_ref.current.value;

      if (
        validateCheck(
          checkID(user_id, id_regEx),
          checkNickname(user_nick, nick_regEx),
          checkPassword(user_pw, pw_regEx),
          checkPasswordAndAgainPassword(user_pw, user_pw_again)
        )
      ) {
        await createUserWithEmailAndPassword(auth, user_id, user_pw);
        await addDoc(collection(db, "auth_users"), {
          user_id: user_id,
          name: user_nick,
          timestamp: getCurrentTime(),
        });
        await addDoc(collection(db, "users_info"), {
          user_id: user_id,
          user_name: user_nick,
          timestamp: getCurrentTime(),
        });
        signOut(auth);
        window.location.replace("/login");
      } else {
        window.alert(`가입 정보를 다시 기입해주세요.`);
      }
    }
  };

  return (
    <div className="signup-wrap">
      <h1>회원 가입</h1>
      <div>
        <div>
          <div className="signup-id">ID :</div>
          <input
            ref={id_ref}
            className="signup-id-input"
            type="email"
            placeholder="abc@naver.com"
            onKeyPress={EnterKeyPreesSignupFB}
          />
          <div
            className="signup-id-error"
            style={{ visibility: FlagID ? "hidden" : "visible" }}
          >
            아이디 형식이 올바르지 않습니다.
          </div>
        </div>
        <div>
          <div className="signup-nickname">Nick name :</div>
          <input
            ref={nick_ref}
            className="signup-nickname-input"
            type="text"
            onKeyPress={EnterKeyPreesSignupFB}
          />
          <div
            className="signup-nicname-error"
            style={{ visibility: FlagNick ? "hidden" : "visible" }}
          >
            닉네임은 2자리 이상입니다.
          </div>
        </div>
        <div>
          <div className="signup-password">Password :</div>
          <input
            ref={pw_ref}
            className="signup-password-input"
            type="password"
            placeholder="패스워드를 입력하세요"
            onKeyPress={EnterKeyPreesSignupFB}
          />
          <div
            className="signup-pasword-error"
            style={{ visibility: FlagPW ? "hidden" : "visible" }}
          >
            패스워드는 8자리 이상입니다.
          </div>
        </div>
        <div>
          <div className="signup-agin-password">Again Password :</div>
          <input
            ref={pw_again_ref}
            className="signup-agin-password-input"
            type="password"
            placeholder="패스워드를 다시 입력하세요."
            onKeyPress={EnterKeyPreesSignupFB}
          />
        </div>
        <div
          className="signup-agin-password-error"
          style={{ visibility: FlagPWAgain ? "hidden" : "visible" }}
        >
          패스워드가 일치하지 않습니다.
        </div>
      </div>
      <button className="signup-bottun" onClick={MouseClickSignupFB}>
        회원 가입하기
      </button>
    </div>
  );
};

export default Signup;
