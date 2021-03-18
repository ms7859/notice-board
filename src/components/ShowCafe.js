import React from "react";

// Home.js에서 cafeObj의 정보를 받아옴
const ShowCafe = ({ cafeObj }) => {
    return (
        <h3 id = {cafeObj.id}>
            {cafeObj.name} {cafeObj.numOfReviews ? `${cafeObj.avgRate.toFixed(1)}/5.0 (${cafeObj.numOfReviews})`  : "No Review"} 
        </h3>
    );
}

export default ShowCafe;