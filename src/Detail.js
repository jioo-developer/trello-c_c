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
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ReactTextareaAutosize from "react-textarea-autosize";
import { db } from "./Firebase";
function Detail(props) {
  let pageTitle = props.page;
  let pageGroup = props.list;
  let fromIndexs = props.from;
  let labelIndex = props.label;
  let dispatch = useDispatch();
  let [checkBtn, setCheckBtn] = useState(false);
  let [title, setTtitle] = useState("");
  let [text, setText] = useState("");
  let [saveText, setSaveText] = useState(false);
  let [label, setLabel] = useState(false);
  let [labelList, setLabelList] = useState([]);
  let loadText = props.detailText;
  let [newLabel, setNewLabel] = useState(false);
  let labelColor = [
    "#618d4f",
    "#f2d600",
    "#ff9f1a",
    "#eb5a46",
    "#c377e0",
    "#0079bf",
    "#ff78cb",
    "#344563",
  ];

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
          window.alert("수정이 완료 되었습니다");
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
        window.alert("수정이 완료 되었습니다");
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

  function hoverEvent(e, argument) {
    e.target.style.boxShadow = `-8px 0 ${argument}`;
  }

  function removeHover(e) {
    e.target.style.boxShadow = "";
  }

  function saveLabel(argument) {
    db.collection("title")
      .doc(fromIndexs[0])
      .collection("article")
      .doc(fromIndexs[1])
      .update({
        label: argument,
      });
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
              }}
              onFocus={() => {
                setCheckBtn(true);
              }}
              onBlur={(e)=>{
                if(e.target.value === ""){
                  setCheckBtn(false)
                }
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
          <p className="inst">
            in list <span>{pageGroup}</span>
          </p>
        </div>
        <ul className="label-area">
          {labelIndex === undefined
            ? labelList
                .filter((value, idx, arr) => {
                  return arr.findIndex((item) => value === item) === idx;
                })
                .map(function (a, i) {
                  return <li style={{ backgroundColor: a }} key={i}></li>;
                })
            : newLabel === false
            ? labelIndex
                .filter((value, idx, arr) => {
                  return arr.findIndex((item) => value === item) === idx;
                })
                .map(function (a, i) {
                  return <li style={{ backgroundColor: a }} key={i}></li>;
                })
            : labelList
                .filter((value, idx, arr) => {
                  return arr.findIndex((item) => value === item) === idx;
                })
                .map(function (a, i) {
                  return <li style={{ backgroundColor: a }} key={i}></li>;
                })}
          <div
            className="label-add"
            onClick={() => {
              setLabel(true);
              setNewLabel(true);
            }}
          >
            +
          </div>
        </ul>
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

                  onBlur={(e)=>{
                  if(e.target.value === ""){
                    setSaveText(false)
                  } 
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
                </div>
              </div>
            ) : (
              <p
                className="description-false"
                onClick={() => {
                  setSaveText(true);
                }}
              >
                {loadText}
              </p>
            )}
          </article>
        </div>
        <article className="btn-area">
          <p>
            <FontAwesomeIcon icon={faGear} size="1x" className="gears" />
            utility
          </p>
          <ul className="btns">
            <li
              onClick={() => {
                setLabel(true);
              }}
            >
              Label
            </li>
            <li
              onClick={() => {
                ondelete();
              }}
            >
              Delete
            </li>
          </ul>
          {label === true ? (
            <>
              <div className="label-detail">
                <div className="label-header">
                  <p>Labels</p>
                  <FontAwesomeIcon
                    icon={faXmark}
                    size="1x"
                    className="label-close"
                    onClick={() => {
                      setLabel(false);
                    }}
                  />
                </div>
                <ul>
                  {labelColor.map(function (a, i) {
                    return (
                      <li
                        key={i}
                        style={{ backgroundColor: a }}
                        onMouseEnter={(e) => {
                          hoverEvent(e, a);
                        }}
                        onMouseLeave={(e) => {
                          removeHover(e);
                        }}
                        onClick={() => {
                          setNewLabel(true);
                          let copyLabel = [...labelList];
                          copyLabel.push(a);
                          saveLabel(copyLabel);
                          setLabelList(copyLabel);
                        }}
                      />
                    );
                  })}
                  <p className="tooltip">라벨을 바꾸시려면 새로 선택하세요.</p>
                </ul>
              </div>
            </>
          ) : null}
        </article>
      </article>
    </section>
  );
}

export default Detail;
