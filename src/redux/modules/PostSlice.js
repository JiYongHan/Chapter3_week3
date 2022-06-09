/*
  Author   : 한지용
  Date     : 2022-06-09
  File     : PostSlice.js
  Detail   : Post button 클릭시, 게시물을 수정 및 삭제할 컴포넌트
          
        function    : 
          getPostList(  )              : Firebase store에 데어터를 가져옴
          updatePostList( email, nickname,
                          url, text_content )       
                                       : UpdatePost에서 가져온 Value들을 수정하기 위한 함수
          addPostList( login_user_email )
                                       : 로그인 된 사용자의 정보를 찾고, nickname과 email를 합쳐 DB에 저장하기 위한 함수
          deletePostList( id )         : 삭제하기 버튼 클릭시 동작하는 미들웨어 함수, id 값을 넘겨 받아 delete해줌
          getCurrentTime()             : 현재 시간을 년,월,일,시,분,초 포맷으로 알맞게 자르기 위한 함수
          padZero( number )            : 자리수를 맞춰주기 위해 0을 넣어주는 함수

*/


import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  updateDoc,
  addDoc,
  where,
  query,
  limit,
  doc,
  getDoc,
  deleteDoc,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const getPostList = createAsyncThunk("GET/getPostList", async () => {
  const response = await getDocs( query ( collection(db, "auth_users"), orderBy( "timestamp", "desc")) );
  
  let list = [];
  response.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() });
  });
  // console.log( list );
  return list;
});

export const updatePostList = createAsyncThunk(
  "UPDATE/updatePostList",
  async (args) => {
    console.log(args.page_select);
    if (args.page_select === "0") {
      args.page_select = "text_left";
    }
    // console.log(args.id);
    const docRef = doc(db, "auth_users", args.id);
    const docSnap = await getDoc(docRef);
    let db_list = [];
    let redux_list = [];
    //console.log( args );
    // delete를 쓰면 특정 키만 지울 수 있음
    // console.log( docSnap.data() );
    db_list = { ...docSnap.data(), ...args };
    redux_list = { id: docSnap.id, ...docSnap.data(), ...args };
    delete db_list.id;
    // console.log( redux_list );
    await updateDoc(docRef, { ...db_list });
    return redux_list;
  }
);

const padZero = ( num ) => {
  return ( num < 10 ? "0" : "" ) + num;
};

const getCurrentTime = () => {
  let now = new Date();
  let result = "" + now.getFullYear() +"/" + padZero( now.getMonth() + 1 ) +"/"+ padZero( now.getDate() ) +" "
   + padZero( now.getHours() )+ ":" + padZero( now.getMinutes() )+ ":" + padZero( now.getSeconds() );
  return result;
}

export const addPostList = createAsyncThunk("ADD/addPostList", async (args) => {
  const response = await getDocs(
    query(
      collection(db, "auth_users"),
      where("user_id", "==", args.user_email)
    ),
    limit(1)
  );
  let get_user_name = "";
  let get_user_id = "";

  response.forEach((item) => {
    get_user_name = item.data().user_name;
    get_user_id = item.data().user_id;
  });
  
  const upload_data = {
    img_url: args.img_path,
    user_name: get_user_name,
    user_id: get_user_id,
    page_select: args.radioValue === "0" ? "text_left" : args.radioValue,
    text_cotent: args.textArea_value,
    like_counst: 0,
    comment_count: 0,
    timestamp: getCurrentTime(),
    like_flag: false,
  };
  
  await addDoc(collection(db, "auth_users"), upload_data);

  return upload_data;
});

export const deletePostList = createAsyncThunk(
  "DELETE/deletePostList",
  async (args) => {
    console.log( args );
    const docRef = doc(db, "auth_users", args );
    console.log( docRef );
    await deleteDoc( docRef );
    return args;
  }
);

const PostSlice = createSlice({
  name: "post",
  initialState: {
    loginCheck: false,
    list: [
      {
      },
    ],
  },
  reducers: {},
  extraReducers: {
    [getPostList.fulfilled]: (state, action) => {
      state.list = [...action.payload ];
    },
    [getPostList.rejected]: (state, action) => {
      console.log("get reject");
    },
    [addPostList.fulfilled]: (state, action) => {
      state.list = [ action.payload, ...state.list ];
    },
    [addPostList.rejected]: (state, action) => {
      console.log("add reject");
    },
    [updatePostList.fulfilled]: (state, action) => {
      console.log(current(state.list));
      let lists = current(state.list).map((item, index) => {
        if (item.id === action.payload.id) {
          return { ...item, ...action.payload };
        } else {
          return item;
        }
      });
      // console.log( lists );
      state.list = lists;
    },
    [updatePostList.rejected]: (state, action) => {
      console.log("no");
    },
    [deletePostList.fulfilled]: (state, action ) => {
      console.log( current( state.list ) );
      console.log( action.payload );
      const lists = current( state.list ).filter( (item, index ) => {
        return item.id !== action.payload;
      });
      console.log( lists );
      state.list = lists;
      console.log("Delete fulfill");
    },
    [deletePostList.rejected]: (state, action) => {
      console.log("Delete reject");
    }
  },
});

export default PostSlice.reducer; 
