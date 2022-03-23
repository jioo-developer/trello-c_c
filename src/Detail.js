import React from "react";
import "./reset.css";
import "./Detail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faCreditCard,
  faList,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ReactTextareaAutosize from "react-textarea-autosize";
function Detail(props) {
  let pageTitle = props.page;
  let pageGroup = props.list;
  console.log(props);
  return (
    <section className="Detail-page">
      <article className="in-page">
        <FontAwesomeIcon icon={faXmark} size="1x" className="page-close" />
        <div className="left_con">
          <div className="page-header">
            <div className="in-wrap">
              <FontAwesomeIcon icon={faCreditCard} size="1x" />
              <p className="page-title">{pageTitle}</p>
            </div>
            <p className="inst">
              in list <span>{pageGroup}</span>
            </p>
          </div>
          <article className="des_area">
            <div className="area-header">
              <FontAwesomeIcon icon={faList} size="1x" />
              <p>Description</p>
              <button type="button">Edit</button>
            </div>
            <ReactTextareaAutosize minRows={5} className="description" />
            <div className="btn_wrap">
              <button type="button" className="save">
                Save
              </button>
              <FontAwesomeIcon icon={faXmark} size="2x" />
            </div>
          </article>
        </div>
        <article className="btn-area">
          <p>utility</p>
          <FontAwesomeIcon icon={faArrowDown} size="1x" />
          <ul className="btns">
            <li>Label</li>
            <li>CheckList</li>
            <li>Delete</li>
          </ul>
        </article>
      </article>
    </section>
  );
}

export default Detail;
