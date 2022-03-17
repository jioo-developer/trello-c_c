import React from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
function Add(props) {
  let dispatch = useDispatch();
  return (
    <div
      className="board-add"
      id={props.index}
      onClick={(e) => {
        dispatch({ type: "에디터열기", payload: e.target.id });
      }}
    >
      <FontAwesomeIcon icon={faPlus} size="1x" />
      Add a card
    </div>
  );
}

export default Add;
