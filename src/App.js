import { React, useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEllipsis,
  faList,
  faPencil,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Edit from "./Edit";
import Add from "./Add";
import "./App.scss";
import "./reset.css";
import { Route, Routes } from "react-router-dom";
import { db } from "./Firebase";
import Detail from "./Detail";
function App() {
  let objArray = [];
  let [list, SetList] = useState([]);
  let [article, setArticle] = useState([]);
  let [loading, setLoading] = useState(false);
  let [updateTitle, setUpdateTitle] = useState("");
  let [titleUpBtn, setTitleUpBtn] = useState(false);
  let [removeCard, setRemoveCard] = useState(false);
  let [textUpdate, setTextUpdate] = useState(false);
  let [pageIndex, setPageIndex] = useState("");
  let [pageTitleIndex, setPageTitleIndex] = useState("");
  let [fromIndex, setFromIndex] = useState("");
  let [text, setText] = useState("");
  let [detailText, setDetailText] = useState("");
  let stateSelector = useSelector((state) => state.EditToggle);
  let stateSelector2 = useSelector((state) => state.updates);
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
            objArray.push({ ...doc.data(), id: doc.id });
            const filterArray = objArray.filter((value, idx, arr) => {
              return (
                arr.findIndex(
                  (item) =>
                    item.id === value.id &&
                    item.fromId === value.fromId &&
                    item.text === value.text
                ) === idx
              );
            });
            setArticle(filterArray);
          });
        });
    });
  }, [list]);

  async function title(argument) {
    try {
      await db
        .collection("title")
        .doc(argument)
        .update({
          title: updateTitle,
        })
        .then(() => {
          let dangerALL = Array.from(document.querySelectorAll(".title-area"));
          dangerALL.map(function (a, i) {
            dangerALL[i].value = "";
          });
          window.alert("제목변경이 완료되었습니다");
        });
    } catch (err) {
      throw err;
    }
  }

  function onDelete(argument) {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      db.collection("title").doc(argument.id).delete();
    } else {
      removeCard(false);
    }
  }

  async function textUP(argument, parameter) {
    try {
      await db
        .collection("title")
        .doc(argument)
        .collection("article")
        .doc(parameter)
        .update({
          title: text,
        })
        .then(() => {
          window.location.reload();
        });
    } catch (err) {
      throw err;
    }
  }

  return (
    <div className="App">
      <header>Trello Clone Coding</header>
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <section className="board_wrap">
                {list.map(function (value, index) {
                  return (
                    <article className="list" key={index} id={list[index].id}>
                      <div className="list-header">
                        <ReactTextareaAutosize
                          className="title-area"
                          id={index}
                          placeholder={value.title}
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

                        {removeCard === false && titleUpBtn === false ? (
                          <FontAwesomeIcon
                            icon={faEllipsis}
                            size="1x"
                            onClick={() => {
                              setRemoveCard(true);
                            }}
                          />
                        ) : titleUpBtn === false ? (
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            size="1x"
                            className="remove-card"
                            value={list[index].id}
                            onClick={() => {
                              setRemoveCard(false);
                              onDelete(value);
                            }}
                          />
                        ) : null}

                        {titleUpBtn === true ? (
                          index === stateSelector2[0].titleIndex ? (
                            <button
                              type="button"
                              className="submit"
                              onClick={() => {
                                let titleUp = [...updateTitle];
                                titleUp.unshift(updateTitle);
                                setUpdateTitle(titleUp);

                                let dangerALL = Array.from(
                                  document.querySelectorAll(".title-area")
                                );

                                let danger = dangerALL[index].value;

                                danger === ""
                                  ? alert("입력되지 않았습니다")
                                  : title(list[index].id);
                              }}
                            >
                              <FontAwesomeIcon icon={faCheck} size="1x" />
                            </button>
                          ) : null
                        ) : null}
                      </div>
                      <div
                        className="list-body"
                        onClick={() => {
                          setTitleUpBtn(false);
                          setRemoveCard(false);
                        }}
                      >
                        {article.map(function (a, i) {
                          return list[index].id === article[i].fromId ? (
                            <article
                              className="card"
                              key={i}
                              onClick={() => {
                                dispatch({ type: "내부페이지진입" });
                                setPageIndex(article[i].title);
                                setPageIndex(article[i].title);
                                setPageTitleIndex(list[index].title);
                                setFromIndex([
                                  article[i].fromId,
                                  article[i].id,
                                ]);
                                setDetailText(article[i].text);
                              }}
                            >
                              {textUpdate === true ? (
                                <ReactTextareaAutosize
                                  className="card-text"
                                  minRows={1.5}
                                  id={i}
                                  onClick={(e) => {
                                    SelectTextArea(e);
                                    dispatch({
                                      type: "내용수정",
                                      payload2: e.target.id,
                                    });
                                  }}
                                  onChange={(e) => {
                                    setText(e.target.value);
                                  }}
                                >
                                  {article[i].title}
                                </ReactTextareaAutosize>
                              ) : (
                                <p>{article[i].title}</p>
                              )}
                              <FontAwesomeIcon
                                icon={faPencil}
                                size="1x"
                                onClick={() => {
                                  setTextUpdate(!textUpdate);
                                }}
                              />
                              {i === stateSelector2[0].textIndex &&
                              textUpdate === true ? (
                                <button
                                  type="button"
                                  className="save"
                                  id={article[i].id}
                                  onClick={(e) => {
                                    let copyNewText = [...text];
                                    copyNewText.unshift(text);
                                    setText(copyNewText);

                                    let danger =
                                      document.querySelector(
                                        ".card-text"
                                      ).value;

                                    danger === ""
                                      ? alert("입력되지 않았습니다")
                                      : textUP(list[index].id, e.target.id);
                                  }}
                                >
                                  save
                                </button>
                              ) : null}

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
              {stateSelector2[0].DetailBtn === true && textUpdate === false ? (
                <Detail
                  page={pageIndex}
                  list={pageTitleIndex}
                  from={fromIndex}
                  detailText={detailText}
                />
              ) : null}
            </main>
          }
        ></Route>
        <Route path="/edit" element={<Edit />} />
        <Route path="/Detail" element={<Detail />} />
      </Routes>
    </div>
  );
}

export default App;
