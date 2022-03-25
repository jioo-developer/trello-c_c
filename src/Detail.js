import React, { useEffect, useState } from "react";
import "./reset.css";
import "./Detail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import {
  faCheck,
  faCircleXmark,
  faCreditCard,
  faGear,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import ReactTextareaAutosize from "react-textarea-autosize";
import { db } from "./Firebase";
function Detail(props) {
  let pageTitle = props.page;
  let pageGroup = props.list;
  let fromIndexs = props.from;
  let dispatch = useDispatch();
  let [checkBtn, setCheckBtn] = useState(false);
  let [title, setTtitle] = useState("");
  let [text, setText] = useState("");
  let [saveText, setSaveText] = useState(false);
  let loadText = props.detailText;

  function SelectTextArea(e) {
    e.target.select();
  }

  function toSelect() {
    document.querySelector(".description").select();
  }

  useEffect(() => {
    if (saveText) {
      toSelect();
    }
  }, [saveText]);

  async function TitleUP(argument) {
    try {
      await db
        .collection("title")
        .doc(argument[0])
        .collection("article")
        .doc(argument[1])
        .update({
          title: title,
        })
        .then(() => {
          window.location.reload();
        });
    } catch (err) {
      throw err;
    }
  }

  async function textUp(argument) {
    await db
      .collection("title")
      .doc(argument[0])
      .collection("article")
      .doc(argument[1])
      .update({
        text: text,
      })
      .then(() => {
        window.location.reload();
      });
  }

  function ondelete() {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      db.collection("title")
        .doc(fromIndexs[0])
        .collection("article")
        .doc(fromIndexs[1])
        .delete()
        .then(() => {
          window.location.reload();
        });
    }
  }

  return (
    <section className="Detail-page">
      <article className="in-page">
        <FontAwesomeIcon
          icon={faCircleXmark}
          size="1x"
          className="page-close"
          onClick={() => {
            dispatch({ type: "수정완료" });
          }}
        />
        <div className="page-header">
          <div className="in-wrap">
            <FontAwesomeIcon icon={faCreditCard} size="1x" />
            <ReactTextareaAutosize
              minRows={1}
              className="page-title"
              onClick={(e) => {
                SelectTextArea(e);
                setCheckBtn(true);
              }}
              onChange={(e) => setTtitle(e.target.value)}
            >
              {pageTitle}
            </ReactTextareaAutosize>
            {checkBtn === true ? (
              <FontAwesomeIcon
                icon={faCheck}
                size="1x"
                onClick={() => {
                  let newTitle = [...title];
                  newTitle.unshift(title);
                  setTtitle(newTitle);

                  let danger = document.querySelector(".page-title").value;
                  danger === ""
                    ? alert("입력되지 않았습니다")
                    : TitleUP(fromIndexs);
                }}
              />
            ) : null}
          </div>
          <p
            className="inst"
            onClick={() => {
              setCheckBtn(false);
            }}
          >
            in list <span>{pageGroup}</span>
          </p>
        </div>
        <div className="left_con">
          <article className="des_area">
            <div className="area-header">
              <FontAwesomeIcon icon={faList} size="1x" />
              <p>Description</p>
              <button
                type="button"
                onClick={() => {
                  setSaveText(true);
                }}
              >
                Edit
              </button>
            </div>
            {saveText === true ? (
              <div className="in-des-area">
                <ReactTextareaAutosize
                  minRows={5}
                  className="description"
                  onClick={(e) => {
                    SelectTextArea(e);
                  }}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                >
                  {loadText}
                </ReactTextareaAutosize>
                <div className="btn_wrap">
                  <button
                    type="button"
                    className="save"
                    onClick={() => {
                      let newText = [...text];
                      newText.unshift(text);
                      setText(newText);

                      let danger = document.querySelector(".description").value;
                      danger === ""
                        ? alert("입력되지 않았습니다")
                        : textUp(fromIndexs);
                    }}
                  >
                    Save
                  </button>
                  <p
                    className="btn-close"
                    onClick={() => {
                      setSaveText(false);
                    }}
                  >
                    close
                  </p>
                </div>
              </div>
            ) : (
              <ReactTextareaAutosize
                className="description-false"
                onClick={() => {
                  setSaveText(true);
                }}
              >
                {loadText}
              </ReactTextareaAutosize>
            )}
          </article>
        </div>
        <article className="btn-area">
          <p>
            <FontAwesomeIcon icon={faGear} size="1x" className="gears" />
            utility
          </p>
          <ul className="btns">
            <li>Label</li>
            <li>CheckList</li>
            <li
              onClick={() => {
                ondelete();
              }}
            >
              Delete
            </li>
          </ul>
        </article>
      </article>
    </section>
  );
}

export default Detail;
