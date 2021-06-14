import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import Title from "./Title";

import {
  DataGrid,
  GridOverlay,
  useGridSlotComponentProps,
} from "@material-ui/data-grid";

import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
// import DateFnsUtils from "@date-io/date-fns";
// import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

// const url = "https://cors-anywhere.herokuapp.com/https://api.omni.chat/v1/";
const url = "https://thingproxy.freeboard.io/fetch/https://api.omni.chat/v1/";
// const url = "https://api.omni.chat/v1/";
const publicKey = process.env.REACT_APP_KEY;
const privateKey = process.env.REACT_APP_SECRET;

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

function CustomPagination() {
  const { state, apiRef } = useGridSlotComponentProps();
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  waiting: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
}));

export default function LogUsers() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState([]);
  // const [dataCriacao, setDataCriacao] = useState(new Date());
  const [count, setCount] = useState(0);

  const columns = [
    { field: "col1", headerName: "Teams ID", width: 150 },
    { field: "col2", headerName: "Nome", width: 320 },
    { field: "col3", headerName: "Status", width: 150 },
    { field: "col4", headerName: "Data Criação", type: "dateTime", width: 220 },
    {
      field: "col5",
      headerName: "Última atualização",
      type: "dateTime",
      width: 220,
    },
    { field: "col6", headerName: "Nome usuário", width: 220 },
    { field: "col7", headerName: "Telefone", width: 180 },
    { field: "col8", headerName: "CreateDate", width: 220, hide: true },
  ];

  useEffect(() => {
    setLoading(true);
    axios({
      method: "GET",
      url: `${url}interactions?limit=500`,
      headers: {
        "x-api-key": publicKey,
        "x-api-secret": privateKey,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      // mode: "cors",
    }).then((res) => {
      const { data } = res;
      const results = data
        .filter((stts) => stts.status === "WAITING")
        .map((row, index) => ({
          id: index,
          col1: row.botFowardedToTeam, // o valor é o mesmo do chat > team > objectId,
          col2: team
            // eslint-disable-next-line
            .map((elem) => {
              if (elem.id === row.botFowardedToTeam) {
                // console.log(elem.name);
                return elem.name;
              }
            })
            .filter((elem) => {
              return elem !== undefined;
            }),
          col3: row.status,
          col4: moment(row.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
          col5: moment(row.updatedAt).format("DD/MM/YYYY - HH:mm:ss"),
          col6: row.chat.name,
          col7: row.chat.platformId, //numero de telefone do cliente
          col8: row.createdAt,
        }));
      setInteractions(results);
      setCount(results.length);
      setLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    team,
    // dataCriacao
  ]);

  useEffect(() => {
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
      const { data } = response;
      const results = data.map((row) => ({
        id: row.objectId,
        name: row.name,
      }));
      setTeam(results);
    });
  }, []);

  const classes = useStyles();

  function refreshPage() {
    setInterval(() => {
      window.location.reload();
    }, 600000);
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Title>Chats em espera</Title>
        <div className={classes.waiting}>
          <p style={{ color: "#696868" }}>Chamados em espera: </p>
          <h3 style={{ marginLeft: 5, color: "#3c3c3b" }}> {count}</h3>
        </div>
        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            label="Data de Criação"
            value={dataCriacao}
            onChange={(date) => setDataCriacao(date)}
            animateYearScrolling
            format="dd/MM/yyyy"
            id="din"
          />
        </MuiPickersUtilsProvider> */}
      </div>

      <div style={{ height: 420, width: "100%" }}>
        {refreshPage()}
        <DataGrid
          loading={loading}
          rows={interactions}
          columns={columns}
          pageSize={20}
          checkboxSelection
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            // Toolbar: CustomToolbar,
            Pagination: CustomPagination,
          }}
          sortModel={[
            {
              field: "col8",
              sort: "desc",
            },
          ]}
          // filterModel={filterModel}

          // filterModel={{
          //   items: [
          //     {
          //       columnField: "col4",
          //       operatorValue: "is before",
          //       value: moment(dataCriacao).format("DD/MM/YYYY - HH:mm:ss"),
          //     },
          //   ],
          // }}
        />
      </div>
    </React.Fragment>
  );
}
