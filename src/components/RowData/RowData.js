import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const url = "https://cors-anywhere.herokuapp.com/https://api.omni.chat/v1/";

const publicKey = process.env.REACT_APP_KEY;
const privateKey = process.env.REACT_APP_SECRET;

export const RowData = ({ team, interact, load }) => {
  const [time, setTime] = useState([]);
  const [interacao, setInteracao] = useState([]);

  //   const [dataCriacao, setDataCriacao] = useState(new Date());
  const [loading, setLoading] = useState(false);

  console.log(loading, interacao);

  useEffect(() => {
    setLoading(true);
    console.log("init teams");
    axios({
      method: "GET",
      url: `${url}teams`,
      headers: {
        "x-api-key": publicKey,
        "x-api-secret": privateKey,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    }).then((response) => {
      console.log("start get");
      setTime(response);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log("init interactions");
    axios({
      method: "GET",
      url: `${url}interactions`,
      headers: {
        "x-api-key": publicKey,
        "x-api-secret": privateKey,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    }).then((response) => {
      setInteracao(response);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(time);

  return (
    <div>
      {time.map((team, interact) => {
        return (
          <>
            key={team.objectId}
            id={team.objectId}
            time={team.name}
            status={interact.status}
            dtCreate=
            {moment(interact.createdAt).format("DD/MM/YYYY - HH:mm:ss")}
            dtUpdate=
            {moment(interact.updatedAt).format("DD/MM/YYYY - HH:mm:ss")}
            name={interact.chat.name}
            contact={interact.customer}
          </>
        );
      })}
    </div>
  );
};
