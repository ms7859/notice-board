import { dbService } from "fbase";
import React, { useState } from "react";

// Home.js에서 데이터 받아옴.
const Gweet = ({ gweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newGweet, setNewGweet] = useState(gweetObj.text); // 수정한 gweet이 저장될 state. 초기값은 기존에 입력해놓은 text

    // 삭제 버튼
    const onDeleteClick = async (event) => {
        const ok = window.confirm("Are you sure you want to delete this gweet?");
        if (ok) {
            await dbService.doc(`gweets/${gweetObj.id}`).delete();
        }
    }

    // editing 토글
    const toggleEditing = () => setEditing(prev => !prev)

    // Submit 버튼(edit)
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`gweets/${gweetObj.id}`).update({
            text: newGweet,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewGweet(value);
    }

    // rendering
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit = {onSubmit}>
                        <input
                            type = "text"
                            placeholder = "Edit your gweet"
                            value = {newGweet}
                            required
                            onChange = {onChange}
                        />
                        <input type = "submit" value = "Update gweet" />
                    </form>
                    <button onClick = {toggleEditing}> Cancle </button>
                </>
            ) : (
                <>
                    <h4>{gweetObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick = {onDeleteClick}> Delete Gweet </button>
                            <button onClick = {toggleEditing}> Edit Gweet </button>
                        </>
                    )}
                </>
            )}
        </div>
    )
};

export default Gweet;