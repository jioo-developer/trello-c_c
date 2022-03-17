import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useSelector, useDispatch } from "react-redux";
import { db } from "./Firebase";
import "./App.scss";

function Edit(props) {
  let [newTitle, setNewTitle] = useState("");
  let [text, setText] = useState("");
  let stateSelector = useSelector((state) => state.EditToggle);
  let dispatch = useDispatch();
  const indexId = props.id;
  async function TitlePost() {
    const Titlecontent = {
      title: newTitle,
    };
    try {
      await db
        .collection("title")
        .add(Titlecontent)
        .then(() => {
          document.querySelector(".board-edit").value = "";
          dispatch({ type: "취소" });
        });
    } catch (err) {
      throw err;
    }
  }

  async function TextPost() {
    const Textcontent = {
      text: text,
    };

    try {
      await db
        .collection("title")
        .doc(indexId)
        .collection("article")
        .add(Textcontent)
        .then(() => {
          document.querySelector(".board-edit").value = "";
          dispatch({ type: "에디터닫기" });
        });
    } catch (err) {
      throw err;
    }
  }

  return (
    <div className="edit_area">
      {stateSelector[0].addCards === true &&
      stateSelector[0].addLists === false ? (
        <>
          <ReactTextareaAutosize
            className="board-edit"
            placeholder="Enter a title for this card..."
            minRows={3}
            cacheMeasurements
            onHeightChange={(height) => {}}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <div className="edit_btn_wrap">
            <button
              type="button"
              className="add_btn"
              onClick={() => {
                let TextArray = [...text];
                TextArray.unshift(text);
                setText(TextArray);

                let danger = document.querySelector(".board-edit").value;

                danger === "" ? alert("입력되지 않았습니다") : TextPost();
              }}
            >
              POST
            </button>
            <button
              type="button"
              className="close_btn"
              onClick={() => {
                dispatch({ type: "에디터닫기" });
              }}
            >
              <FontAwesomeIcon icon={faXmark} size="1x" />
            </button>
          </div>
        </>
      ) : stateSelector[0].addCards === false &&
        stateSelector[0].addLists === true ? (
        <>
          <ReactTextareaAutosize
            className="board-edit"
            placeholder="Enter a title for this Title..."
            minRows={3}
            cacheMeasurements
            onHeightChange={(height) => {}}
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
          />
          <div className="edit_btn_wrap">
            <button
              type="button"
              className="add_btn"
              onClick={() => {
                let TitleArray = [...newTitle];
                TitleArray.unshift(newTitle);
                setNewTitle(TitleArray);

                let danger = document.querySelector(".board-edit").value;

                danger === "" ? alert("입력되지 않았습니다") : TitlePost();
              }}
            >
              POST
            </button>
            <button
              type="button"
              className="close_btn"
              onClick={() => {
                dispatch({ type: "취소" });
              }}
            >
              <FontAwesomeIcon icon={faXmark} size="1x" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Edit;
