import { React, useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import Edit from "./Edit";
import Add from "./Add";
import "./App.scss";
import "./reset.css";
import { Route, Routes } from "react-router-dom";
import { db } from "./Firebase";
function App() {
  let objArray = [];
  let [list, SetList] = useState([]);
  let [article, setArticle] = useState([]);
  let [loading, setLoading] = useState(false);
  let [updateTitle, setUpdateTitle] = useState("");
  let [titleUpBtn, setTitleUpBtn] = useState(false);
  let stateSelector = useSelector((state) => state.EditToggle);
  let stateSelector2 = useSelector((state) => state.TitleUpdate);
  let dispatch = useDispatch();
  function SelectTextArea(e) {
    e.target.select();
  }

  useEffect(() => {
    db.collection("title").onSnapshot((snapshot) => {
      let titleArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      SetList(titleArray);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 400);
  }, [list]);

  useEffect(() => {
    list.forEach(function (a) {
      db.collection("title")
        .doc(a.id)
        .collection("article")
        .onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            objArray.push(doc.data());
            setArticle(objArray);
          });
        });
    });
  }, [list]);

  return (
    <div className="App">
      <header>Trello Clone Coding</header>
      <Routes>
        <Route
          path="/"
          element={
            <section className="board_wrap">
              {list.map(function (value, index) {
                return (
                  <article className="list" key={index}>
                    <div className="list-header">
                      <ReactTextareaAutosize
                        className="title-area"
                        id={index}
                        value={value.title}
                        onClick={(e) => {
                          SelectTextArea(e);
                          setTitleUpBtn(true);
                          dispatch({
                            type: "타이틀수정버튼",
                            payload: e.target.id,
                          });
                        }}
                        onChange={(e) => {
                          setUpdateTitle(e.target.value);
                        }}
                      />
                      {titleUpBtn === true ? (
                        index === stateSelector2[0].titleIndex ? (
                          <button type="button">submit</button>
                        ) : null
                      ) : null}
                    </div>
                    <div
                      className="list-body"
                      onClick={() => {
                        setTitleUpBtn(false);
                      }}
                    >
                      {article.map(function (a, i) {
                        return list[index].id === article[i].fromId ? (
                          <article className="card" key={i}>
                            <p>{article[i].text}</p>
                            <FontAwesomeIcon icon={faPencil} size="1x" />
                            <div className="icon_wrap">
                              <FontAwesomeIcon icon={faList} size="1x" />
                            </div>
                          </article>
                        ) : null;
                      })}
                    </div>
                    <div className="list-body">
                      {stateSelector[0].addCards === true ? (
                        index === stateSelector[0].btnIndex ? (
                          <Edit id={list[index].id} list={list} />
                        ) : (
                          <Add index={index} />
                        )
                      ) : (
                        <Add index={index} />
                      )}
                    </div>
                  </article>
                );
              })}
              {loading === true ? (
                <>
                  <article className="another-list">
                    {stateSelector[0].addLists === true ? (
                      <Edit list={list} />
                    ) : (
                      <>
                        <button
                          type="button"
                          className="another-add"
                          onClick={() => {
                            dispatch({ type: "추가리스트" });
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} size="1x" />
                          add Another List
                        </button>
                      </>
                    )}
                  </article>
                </>
              ) : null}
            </section>
          }
        ></Route>
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </div>
  );
}

export default App;
