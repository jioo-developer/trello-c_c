import { React, useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Edit from "./Edit";
import Add from "./Add";
import "./App.scss";
import "./reset.css";
import { Route, Routes } from "react-router-dom";
import { db } from "./Firebase";
function App() {
  let order;
  let object = {}
  let [list, SetList] = useState([]);
  let [loading, setLoading] = useState(false);
  let [articleItem, setArticle] = useState([]);
  let stateSelector = useSelector((state) => state.EditToggle);
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

    for(var i=0; i<list.length; i++){
      let filterId = list[i].id
      db.collection("title").doc(list[i].id).collection("article").onSnapshot((snapshot)=>{
        snapshot.docs.map((doc)=>{
          console.log(doc.data())
        })
      })
    }
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
                  <article
                    className="list"
                    key={index}
                    style={
                      (order = {
                        order: list[index].order,
                      })
                    }
                  >
                    <div className="list-header">
                      <ReactTextareaAutosize
                        className="title-area"
                        value={value.title}
                        onClick={SelectTextArea}
                      />
                    </div>
                    <div className="list-body">
                      <article className="card">
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an end
                        </p>
                        <div className="icon_wrap">
                          <FontAwesomeIcon icon={faList} size="1x" />
                          <FontAwesomeIcon icon={faThumbsUp} size="1x" />
                        </div>
                      </article>
                    </div>
                    <div className="list-body">
                      {stateSelector[0].addCards === true ? (
                        index === stateSelector[0].btnIndex ? (
                          <Edit id={list[index].id} list={list}/>
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
                      <Edit list={list}/>
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
