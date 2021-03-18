import { render } from "@testing-library/react";
import Review from "components/Review";
import ShowCafe from "components/ShowCafe";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

/*
구현한 기능
1. 카페별로 평가 남기기
2. 카페를 평가할 때 별점 남기기
3. 카페를 띄울 때 평가한 별점의 평균값과 평가 개수 띄우기

구현해야 할 기능
1. 리뷰는 한 계정당 한 번만
2. 지도 api에서 카페 list를 받을 수 있도록
3. 내가 방문했던 카페(리뷰를 작성하면 방문한 걸로 할 수도 있을 듯)

4. 정렬(리뷰 많은 순, 별점 순, 가까운 순 등등...) (작동이 안 됨)
5. 
*/

const Home = ({ userObj }) => {
    const [clickedCafe, setClickedCafe] = useState(""); // 현재 선택된 카페의 id
    const [reviews, setReviews] = useState([]);         // 현재 선택한 카페의 리뷰들

    const [rate, setRate] = useState(-1);               // 현재 선택한 평점
    const [review, setReview] = useState("");           // 현재 작성중인 리뷰

    const [cafeList, setCafeList] = useState([]);       // 지도 api에서 가져온 카페 list

    const [sortOrder, setSortOrder] = useState("");
    
    useEffect(() => {
        dbService.collection("review").onSnapshot(snapshot => {
            // database에 저장된 리뷰 전부 가져와 reviewArray에 저장
            const reviewArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // varCafeList에는 지도 api에서 가져온 배열을 넣으면 될 듯?
            var varCafeList = tmpCafeList; // cafeList를 쓰면 왜 안 되지
            
            // 지도 api에서 가져온 배열 안에 있는 객체들에는 내가 원하는 element들이 없음. 따라서 이를 추가
            varCafeList.forEach(cafe => {
                cafe.totalRate = 0;     // 평점 총점
                cafe.numOfReviews = 0;  // 리뷰 개수
                cafe.avgRate = 0;       // 평균 평점
            });

            // database에 있는 모든 리뷰들에 대해서
            reviewArray.forEach(review => {
                // 현재 지도에서 가져온 카페 목록 중 어떤 카페의 리뷰인지 찾음
                const index = varCafeList.findIndex(cafe => cafe.id === review.cafeId);

                // 해당 카페의 별점과 리뷰 개수를 늘려줌(지도에 없는 카페의 리뷰는 무시)
                if (index > -1) {
                    varCafeList[index].numOfReviews += 1;
                    varCafeList[index].totalRate += parseInt(review.rate);
                }
            });

            varCafeList.forEach(cafe => {
                if (cafe.numOfReviews > 0) {
                    cafe.avgRate = Math.round((cafe.totalRate / cafe.numOfReviews) * 10) / 10;
                }
            });

            
            if (sortOrder === "rate") {
                varCafeList.sort((a, b) => {
                    return a.avgRate < b.avgRate ? 1 : -1;
                });
            } else if (sortOrder === "review") {
                console.log("review");
            } else {
                console.log("default");
            }
            

            setCafeList(varCafeList);
        });
    }, [sortOrder]);

    // cafe 선택
    const onClickCafe = (event) => {
        const {
            target:{id}
        } = event;

        setClickedCafe(id);

        if (clickedCafe === id){
            setClickedCafe("");
        } else {
            setClickedCafe(id);
        }

        dbService.collection("review").onSnapshot(snapshot => {
            const unfilteredArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const filteredArray = unfilteredArray.filter(obj => obj.cafeId === id);
            setReviews(filteredArray);
        });
    }

    // review 입력
    const onSubmit = async (event) => {
        event.preventDefault();
        if (rate > 0 && review !== "") {
            // database에 저장
            await dbService.collection("review").add({
                text: review,
                createAt: Date.now(),
                creatorId: userObj.uid,
                cafeId: clickedCafe,
                rate: rate
            });
            setReview("");
            setRate(-1);
        } else {
            alert("별점과 후기를 모두 입력해주세요.");
        }
    };
    const onChange = (event) => {
        const {
            target:{value}
        } = event;
        setReview(value);
    };

    // 별점 선택
    const onClickStar = (event) => {
        const {
            target:{id}
        } = event;

        setRate(id);
    }

    
    const onChangeSort = (event) => {
        const {
            target:{value}
        } = event;

        setSortOrder(value);
    }
    
    
    return (
        <div>
            <h1> clickedCafe: {clickedCafe} </h1>

            <select name = "cafe" onChange = {onChangeSort}>
                <option value = ""> 정렬 순서 </option>
                <option value = "rate"> 별점순 </option>
                <option value = "review"> 리뷰순 </option>
            </select>

            <div>
                {cafeList.map((cafe) => (
                    <form key = {cafe.id} onClick = {onClickCafe}>
                        <ShowCafe
                            key = {cafe.id}
                            cafeObj = {cafe}
                        />
                    </form>
                ))}
            </div>

            {clickedCafe ? (
                <>
                    {rate > 0 ? 
                        <button id = {1} onClick = {onClickStar}> ★ </button> :
                        <button id = {1} onClick = {onClickStar}> ☆ </button> }

                    {rate > 1 ? 
                        <button id = {2} onClick = {onClickStar}> ★ </button> :
                        <button id = {2} onClick = {onClickStar}> ☆ </button> }

                    {rate > 2 ? 
                        <button id = {3} onClick = {onClickStar}> ★ </button> :
                        <button id = {3} onClick = {onClickStar}> ☆ </button> }

                    {rate > 3 ? 
                        <button id = {4} onClick = {onClickStar}> ★ </button> :
                        <button id = {4} onClick = {onClickStar}> ☆ </button> }

                    {rate > 4 ? 
                        <button id = {5} onClick = {onClickStar}> ★ </button> :
                        <button id = {5} onClick = {onClickStar}> ☆ </button> }

                    <form onSubmit = {onSubmit}>
                        <input
                            value = {review}
                            onChange = {onChange}
                            type = "text"
                            placeholder = "후기를 남겨주세요."
                            maxLength = {120}
                        />
                        <input type = "submit" value = "Upload" />
                    </form>

                    <div>
                        {reviews.map((review) => (
                            <Review
                                key = {review.id}
                                reviewObj = {review}
                                isOwner = {review.creatorId === userObj.uid}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

const tmpCafeList = [
    {
        name: "카페 A",
        id: "a001"
    },
    {
        name: "카페 B",
        id: "a002"
    },
    {
        name: "카페 C",
        id: "a003"
    },
    {
        name: "카페 D",
        id: "a004"
    },
    {
        name: "카페 E",
        id: "a005"
    }
];

export default Home;