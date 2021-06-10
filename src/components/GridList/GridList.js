import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

// import Title from "./Title";

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

// import api from "../../services/api";
// import RowData from "../RowData/RowData";

const url = "https://cors-anywhere.herokuapp.com/https://api.omni.chat/v1/";
const publicKey = process.env.REACT_APP_KEY;
const privateKey = process.env.REACT_APP_SECRET;

function RowData({ team, interact, load }) {
  const [time, setTime] = useState([team]);
  const [interacao, setInteracao] = useState([interact]);

  //   const [dataCriacao, setDataCriacao] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // console.log(loading, interacao);

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
    <>
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
    </>
  );
}

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
}));

export default function LogUsers(team, interact, load) {
  const props = { team, interact, load };

  console.log(RowData({ team, interact, load }));

  console.log(props.team);
  // const [query, setQuery] = useState([]);

  // console.log(query);

  const columns = [
    { field: "col1", headerName: "Teams ID", width: 150 },
    { field: "col2", headerName: "Nome", width: 220 },
    { field: "col3", headerName: "Status", width: 150 },
    { field: "col4", headerName: "Data Criação", width: 220 },
    { field: "col5", headerName: "Última atualização", width: 250 },
    { field: "col6", headerName: "Nome usuário", width: 220 },
    { field: "col7", headerName: "Telefone", width: 180 },
  ];
  const rows = [
    {
      id: 1,
      col1: "saDd87aDS2",
      col2: "LG51",
      col3: "WAITING",
      col4: "25/01/2021",
      col5: "28/01/2021",
      col6: "João",
      col7: "75999999999",
    },
  ];

  // const classes = useStyles();

  return (
    <React.Fragment>
      {/* <div className={classes.root}>
        <Title>Chats em espera</Title>
      </div> */}

      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          // loading={loading}
          rows={rows}
          columns={columns}
          pageSize={20}
          checkboxSelection
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            // Toolbar: CustomToolbar,
            Pagination: CustomPagination,
          }}
          filterModel={{
            items: [
              {
                columnField: "col3",
                operatorValue: "contains",
                value: "waiting",
              },
            ],
          }}
        />
      </div>
    </React.Fragment>
  );
}
