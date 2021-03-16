import Gweet from "components/Gweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

// 로그인되어 있을 때 홈페이지 띄움
const Home = ( {userObj} ) => { // AppRouter에서 user의 정보를 전달받음.
    const [gweet, setGweet] = useState("");   // input에 입력되는 string
    const [gweets, setGweets] = useState([]); // database에 저장된 
    
    // componentDidMount
    useEffect(() => {
        dbService.collection("gweets").onSnapshot(snapshot => { // database의 gweets 컬렉션에 저장된 snapshot을 가져와
            const gweetArray = snapshot.docs.map(doc => ({      // snapshot 내에 있는 각각의 docs들에 고유 id를 붙여서
                id: doc.id,
                ...doc.data()
            }));
            setGweets(gweetArray);   //gweets에 저장
        });
    }, []);

    // Gweet 버튼을 누르면 database에 gweet 추가
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("gweets").add({ // database의 gweets 컬렉션에 document 추가
            text: gweet,            // 필드: 값
            createAt: Date.now(),   // 필드: 값
            creatorId: userObj.uid, // gweet를 작성한 user의 고유 id를 같이 저장
            // 별점 여기에 들어가야 할 듯
        });
        setGweet("");
    };
    const onChange = (event) => {
        const {
            target:{value}
        } = event;
        setGweet(value);
    };

    // rendering
    return(
        <div>
            <form onSubmit = {onSubmit}>
                <input
                    value = {gweet}
                    onChange = {onChange}
                    type = "text"
                    placeholder = "What's on your mind?"
                    maxLength = {120}
                />
                <input type = "submit" value = "Gweet" />
            </form>
            <div>
                {gweets.map((gweet) => ( // gweets의 배열에 저장된 각각의 gweet(object)들에 대해 
                    <Gweet
                        key = {gweet.id}
                        gweetObj = {gweet}
                        isOwner = {gweet.creatorId === userObj.uid}
                    /> 
                ))} {/* Gweet에 gweet의 고유 id, gweet 객체, 해당 gweet가 현재 로그인된 user가 작성한 gweet인지 여부에 대한 정보를 같이 전달 */}
            </div>
        </div>
    );
};
export default Home;