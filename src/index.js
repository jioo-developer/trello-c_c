import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { BrowserRouter } from "react-router-dom";

let defaultData = [
  {
    addCards: false,
    addLists: false,
    btnIndex: 0,
  },
];

let update = [
  {
    titleIndex: 0,
  },
];

function EditToggle(state = defaultData, action) {
  if (action.type === "에디터열기") {
    let open = [...defaultData];
    open[0].addLists = false;
    open[0].addCards = true;
    open[0].btnIndex = Number(action.payload);
    return open;
  } else if (action.type === "에디터닫기") {
    let close = [...defaultData];
    close[0].addCards = false;
    return close;
  } else if (action.type === "추가리스트") {
    let add = [...defaultData];
    add[0].addCards = false;
    add[0].addLists = true;
    return add;
  } else if (action.type === "취소") {
    let del = [...defaultData];
    del[0].addLists = false;
    return del;
  } else {
    return state;
  }
}

function TitleUpdate(state = update, action) {
  if (action.type === "타이틀수정버튼") {
    let open = [...update];
    open[0].titleIndex = Number(action.payload);
    console.log(open);
    return open;
  } else {
    return state;
  }
}

let store = createStore(combineReducers({ EditToggle, TitleUpdate }));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
