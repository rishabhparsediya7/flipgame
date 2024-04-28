import Confetti from "react-confetti";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import apple from "/apple.png";
import mango from "/mango.png";
import banana from "/banana.png";
import watermelon from "/watermelon.png";
import peach from "/peach.png";
import kiwi from "/kiwi.png";
import strawberry from "/strawberry.png";
import pomegranate from "/pomegranate.png";

export default function App() {
  const imagesArray = [
    {
      name: "apple",
      image: apple,
    },
    {
      name: "banana",
      image: banana,
    },
    {
      name: "mango",
      image: mango,
    },
    {
      name: "kiwi",
      image: kiwi,
    },
    {
      name: "strawberry",
      image: strawberry,
    },
    {
      name: "watermelon",
      image: watermelon,
    },
    {
      name: "peach",
      image: peach,
    },
    {
      name: "pomegranate",
      image: pomegranate,
    },
  ];

  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const [timer, setTimer] = useState(10);
  const [button, setButton] = useState(false);
  let flipArray = [1, 0, 4, 6, 5, 3, 7, 2, 4, 6, 7, 3, 2, 1, 0, 5];
  const MAX_INDEX = 16;
  const ref = useRef([]);
  const [numbers, setNumber] = useState([]);
  const [display, setDisplay] = useState(
    Array.from({ length: 16 }).fill(false)
  );
  const [turn, setTurn] = useState("1");
  const [indexes, setIndexes] = useState({ prev: -1, current: -1 });
  const showValue = (index) => {
    const newDisplay = [...display];
    newDisplay[index] = true;
    setDisplay(newDisplay);
  };
  const hideValue = (index) => {
    const newDisplay = [...display];
    newDisplay[index] = false;
    setDisplay(newDisplay);
  };
  const checkValuesAreTrue = (prevIndex, currentIndex) => {
    const previousValue = parseInt(
      ref.current[prevIndex].querySelector("h1").innerHTML
    );
    const currentValue = parseInt(
      ref.current[currentIndex].querySelector("h1").innerHTML
    );
    return previousValue === currentValue;
  };
  const handleDisplay = (index) => {
    showValue(index);
    if (turn === "1") {
      setIndexes((ind) => ({ ...ind, prev: index }));
      setTurn("2");
    } else if (turn === "2") {
      setIndexes((ind) => ({ ...ind, current: index }));
      const check = checkValuesAreTrue(indexes.prev, index);
      if (check) {
        console.log("previous numbers are same");
      } else {
        setTimeout(() => {
          hideValue(indexes.prev, index);
        }, 200);
      }
      setIndexes({ prev: -1, current: -1 });
      setTurn("1");
    }
  };
  const getNumbers = () => {
    for (let i = 0; i < flipArray.length; i++) {
      const index1 = Math.floor(Math.random() * MAX_INDEX);
      const index2 = Math.floor(Math.random() * MAX_INDEX);
      const temp = flipArray[index2];
      flipArray[index2] = flipArray[index1];
      flipArray[index1] = temp;
    }
    return flipArray;
  };
  let intervalId = null;
  const countDown = () => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(intervalId);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  };
  const getWinner = () => {
    const check = display.every((value) => value === true);
    if (check) {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
    return check;
  };

  useEffect(() => {
    getNumbers();
  }, []);
  useEffect(() => {
    setNumber(flipArray);
  }, []);
  return (
    <div className="App">
      <div className="box">
        {numbers.length === MAX_INDEX &&
          numbers.map((flip, index) => (
            <div
              ref={(e) => (ref.current[index] = e)}
              onClick={() => handleDisplay(index)}
              key={index}
              className="flip-box"
            >
              <img
                style={{
                  display: display[index] ? "block" : "none",
                  height: "50px",
                  width: "50px",
                }}
                src={imagesArray[flip].image}
                alt={imagesArray[flip].name}
              />
              <h1 style={{ display: "none" }}>{flip}</h1>
            </div>
          ))}
      </div>
      {getWinner() ? (
        <h1 style={{ color: "white" }}>Yayyy! We solved this!</h1>
      ) : (
        <div>
          {turn === "1" && (
            <h1 style={{ color: "white" }}>Chose first symbol</h1>
          )}
          {turn === "2" && (
            <h1 style={{ color: "white" }}>Chose second symbol</h1>
          )}
        </div>
      )}

      {getWinner() ? (
        <div>
          <Confetti width={width} height={height} />{" "}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
