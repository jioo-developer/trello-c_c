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
  faXmark,
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
  let [textUpdate, setTextUpdate] = useState(false);
  let [pageIndex, setPageIndex] = useState("");
  let [pageTitleIndex, setPageTitleIndex] = useState("");
  let [fromIndex, setFromIndex] = useState("");
  let [text, setText] = useState("");
  let [detailText, setDetailText] = useState("");
  let [labelIndex, setLabelIndex] = useState("");
  let stateSelector = useSelector((state) => state.EditToggle);
  let stateSelector2 = useSelector((state) => state.updates);
  let [minRow, setMinRow] = useState(1.5);
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
                  (item) => item.id === value.id && item.fromId === value.fromId
                ) === idx
              );
            });
            setArticle(filterArray);
          });
        });
    });
  }, [list]);

  function onDelete(argument) {
    const ok = window.confirm("?????? ?????????????????????????");
    if (ok) {
      db.collection("title")
        .doc(argument.id)
        .delete()
    }
  }

  async function title(argument) {
    console.log(argument)
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
          window.alert("??????????????? ?????????????????????");
          setTitleUpBtn(false);
        });
    } catch (err) {
      throw err;
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
          window.alert("????????? ?????? ???????????????");
          window.location.reload();
        });
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    if (textUpdate) {
      document.querySelector(".board_wrap").classList.add("black");
    } else {
      document.querySelector(".board_wrap").classList.remove("black");
    }
  }, [textUpdate]);

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
                          onClick={(e) => {
                            SelectTextArea(e);
                            dispatch({
                              type: "?????????????????????",
                              payload: e.target.id,
                            });
                          }}
                          onChange={(e) => {
                            setUpdateTitle(e.target.value);
                          }}
                          onFocus={() => {
                            setTitleUpBtn(true);
                          }}
                          onBlur={(e)=>{
                            if(e.target.value === ""){
                              setTitleUpBtn(false)
                            }
                          }}
                          
                        >{value.title}</ReactTextareaAutosize>

                        {titleUpBtn === false ? (
                          <FontAwesomeIcon
                            icon={faEllipsis}
                            size="1x"
                            value={list[index].id}
                            onClick={() => {
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
                                  ? alert("???????????? ???????????????")
                                  : title(list[index].id);
                              }}
                            >
                              <FontAwesomeIcon icon={faCheck} size="1x" />
                            </button>
                          ) : null
                        ) : null}
                      </div>
                      <div className="list-body">
                        {article.map(function (a, i) {
                          return list[index].id === article[i].fromId ? (
                            <article
                              className="card"
                              key={i}
                              onClick={() => {
                                if(textUpdate === false){
                                  const ok = window.confirm("?????????????????? ?????????????????????????")
                                  if(ok){
                                    dispatch({ type: "?????????????????????" });
                                   } 
                                }
                                setPageIndex(article[i].title);
                                setPageIndex(article[i].title);
                                setPageTitleIndex(list[index].title);
                                setLabelIndex(article[i].label);
                                setFromIndex([
                                  article[i].fromId,
                                  article[i].id,
                                ]);
                                setDetailText(article[i].text);
                              }}
                            >
                              {textUpdate === false ? (
                                <ul className="label-wrap">
                                  {article[i].label === undefined
                                    ? null
                                    : article[i].label.map(function (a1, i1) {
                                        return (
                                          <li
                                            style={{ backgroundColor: a1 }}
                                            className="show-label"
                                            key={i1}
                                          ></li>
                                        );
                                      })}
                                </ul>
                              ) : null}

                              <ReactTextareaAutosize
                                className={`card-text card-text${i}`}
                                minRows={minRow}
                                id={i}
                                onClick={(e) => {
                                  SelectTextArea(e);
                                  dispatch({
                                    type: "????????????",
                                    payload2: e.target.id,
                                  });
                                }}
                                onFocus={(e) => {
                                  setTextUpdate(true);
                                  setMinRow(3);
                                  e.target.classList.add("margin");
                                }}

                                onBlur={()=>{
                                  setTextUpdate(false);
                                  setMinRow(1.5);
                                  document.querySelector(`.card-text${i}`).classList.remove("margin")
                                }}
                                onChange={(e) => {
                                  setText(e.target.value);
                                }}
                              >
                                {article[i].title}
                              </ReactTextareaAutosize>
                              <FontAwesomeIcon icon={faPencil} size="1x" />
                              {i === stateSelector2[0].textIndex &&
                              textUpdate === true ? (
                                <div className="update-wrap">
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
                                        ? alert("???????????? ???????????????")
                                        : textUP(list[index].id, e.target.id);
                                    }}
                                  >
                                    save
                                  </button>
                                </div>
                              ) : null}
                              {textUpdate === false ? (
                                <>
                                  <div className="icon_wrap">
                                    <FontAwesomeIcon icon={faList} size="1x" />
                                  </div>
                                </>
                              ) : null}
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
                              dispatch({ type: "???????????????" });
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
                  label={labelIndex}
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
