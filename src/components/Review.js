import { dbService } from "fbase";
import React, { useState } from "react";

// Home.js에서 데이터 받아옴.
const Review = ({ reviewObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newReview, setNewReview] = useState(reviewObj.text);

    // 삭제 버튼
    const onDeleteClick = async (event) => {
        const ok = window.confirm("Are you sure you want to delete this review?");
        if (ok) {
            await dbService.doc(`review/${reviewObj.id}`).delete();
        }
    }

    // editing 토글
    const toggleEditing = () => setEditing(prev => !prev)

    // Submit 버튼(edit)
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`review/${reviewObj.id}`).update({
            text: newReview,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewReview(value);
    }

    // rendering
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit = {onSubmit}>
                        <input
                            type = "text"
                            placeholder = "Edit your review"
                            value = {newReview}
                            required
                            onChange = {onChange}
                        />
                        <input type = "submit" value = "Update review" />
                    </form>
                    <button onClick = {toggleEditing}> Cancle </button>
                </> 
            ) : (
                <>
                    <h4>{reviewObj.text} {"★".repeat(reviewObj.rate) + "☆".repeat(5 - reviewObj.rate)}</h4>
                    {isOwner && (
                        <>
                            <button onClick = {onDeleteClick}> Delete review </button>
                            <button onClick = {toggleEditing}> Edit review </button>
                        </>
                    )}
                </>
            )}
        </div>
    )
};

export default Review;