//import logo from './logo.svg';
import React from "react";
import Table from "react-bootstrap/Table";
import "./App.css";

function Datafetch(props) {

  // luodaan tilat eri muuttujille
  let [volume, setVolume] = React.useState([]);
  let [result, setResult] = React.useState([]);
  let [value, setValue] = React.useState(0);
  let [counter, setCounter] = React.useState(0);
  let [date, setDate] = React.useState("");
  let [profit, setProfit] = React.useState(0);
  let [buydate, setbuyDate] = React.useState("");
  let [selldate, setsellDate] = React.useState("");
  var second_counter = 0;

  var cryptoArray = [];
  var cryptoArray2 = [];
 // hintojen vertailu
  const ComparePrices = () => {
    var Array = [];

    for (var i = 0; i < result.length; i++) {
      if (i > 0 && result[i][1] < result[i - 1][1]) {
        second_counter++;
      } else {
        Array.push(second_counter);
        second_counter = 0;
      }
    }
    Array.push(second_counter);

    const amounts = Array.map((a) => a);
    const highestAmount = Math.max(...amounts);

    setCounter(highestAmount);
  };
  // volyymien vertailu
  const CompareVolumes = () => {
    const amounts = volume.map((a) => a[1]);
    const highestAmount = Math.max(...amounts);
    if (volume.length === 0) {
      console.log("No volume");
      setDate();
      setValue();
    } else {
      volume.forEach((element) => {
        if (element[1] === highestAmount) {
          var date = new Date(element[0]).toLocaleString("fi-FI", {
            timeZone: "UTC",
          });
          setDate(date);
          setValue(highestAmount);
        }
      });
    }
  };
 // funktio, joka katsoo koska on järkevintä ostaa ja myydä bitcoinia
  const BuyAndSell = () => {
    //console.log(result.length);
    if (result.length === 0) {
      console.log("Check dates!");
      setbuyDate();
      setsellDate();
      setProfit();
    } else if (result.length === 1) {
      console.log("Nothing to compare to");
      setbuyDate();
      setsellDate();
      setProfit();
    } else {
      let max_diff = 0;

      let min_date = 0;
      let max_date = 0;

      if (result.length <= 2) {
        min_date = result[0][0];
        max_date = result[1][0];

        max_diff = result[1][1] - result[0][1];
        var datetime1 = new Date(min_date).toLocaleString("fi-FI", {
          timeZone: "UTC",
        });
        var datetime2 = new Date(max_date).toLocaleString("fi-FI", {
          timeZone: "UTC",
        });
        setbuyDate(datetime1);
        setsellDate(datetime2);
        setProfit(max_diff);
        if (max_diff < 0) {
          setbuyDate();
          setsellDate();
          setProfit();
        }
      } else {
        for (let i = 0; i < result.length; i++) {
          for (let j = i + 1; j < result.length; j++) {
            if (
              result[j][1] - result[i][1] > max_diff &&
              result[j][0] > result[i][0]
            ) {
              max_diff = result[j][1] - result[i][1];
              max_date = result[j][0];
              min_date = result[i][0];
            } else if (max_diff === 0) {
              max_diff = "";
              max_date = 0;
              min_date = 0;
            }
          }
        }

        var datetime3 = new Date(min_date).toLocaleString("fi-FI", {
          timeZone: "UTC",
        });
        var datetime4 = new Date(max_date).toLocaleString("fi-FI", {
          timeZone: "UTC",
        });
        if (datetime3 && datetime4 === "1.1.1970 klo 0.00.00") {
          setProfit("");
          setbuyDate("");
          setsellDate("");
        } else {
          setProfit(max_diff);
          setbuyDate(datetime3);
          setsellDate(datetime4);
        }
      }
    }
  };

  //datan hakeminen apista
  React.useEffect(() => {
    async function fetchCryptoData() {
      if (props.timeBegin > props.timeEnd) {
        console.log("Check dates");
      }

      let hr =
        await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_c
urrency=eur&from=${props.timeBegin}&to=${props.timeEnd}`);
      let data = await hr.json();

      let variable = data.prices;
      let variable2 = data.total_volumes;
      if (props.timeEnd - props.timeBegin < 7776000) {
        for (const key in variable) {
          if (key % 24 === 0) {
            cryptoArray.push(variable[key]);
          }
        }
        for (const key in variable2) {
          if (key % 24 === 0) {
            cryptoArray2.push(variable2[key]);
          }
        }

        setResult(cryptoArray);

        setVolume(cryptoArray2);
      } else {
        for (const key in variable) {
          cryptoArray.push(variable[key]);
        }
        for (const key in variable2) {
          cryptoArray2.push(variable2[key]);
        }
        setResult(cryptoArray);

        setVolume(cryptoArray2);
      }
    }
    fetchCryptoData();
  }, [props.timeBegin, props.timeEnd]);
  //tulostetaan näytölle haettu data ja sen käsittelyn jälkeen halutut tiedot
  return (
    <div>
      <h2>Bitcoin price and date</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Price (Euros)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {result.map((item, i) => (
            <tr key={i}>
              <td>{item[1]}</td>
              <td>
                {new Date(item[0]).toLocaleString("fi-FI", { timeZone: "UTC" })}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p>Longest bearish trend on given data range : {counter} days</p>
      <p>
        Highest trading volumes on given data range: {value} Euros on the date:{" "}
        {date}
      </p>
      <p>
        Best profits given data range: {profit} Euros and best day to buy is{" "}
        {buydate} and best day to sell is {selldate}
      </p>
      <button onClick={ComparePrices}>
        Longest bearish trend on given date range button
      </button>
      <button onClick={CompareVolumes}>
        Highest trading volumes on given date range button
      </button>
      <button onClick={BuyAndSell}>When to buy and when to sell button</button>
    </div>
  );
}

export default Datafetch;
