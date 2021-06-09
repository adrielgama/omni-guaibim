import React, { useState, useEffect } from "react";
import axios from "axios";
// import moment from "moment";

import Title from "./Title";

import {
  DataGrid,
  GridOverlay,
  useGridSlotComponentProps,
} from "@material-ui/data-grid";

import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

// import api from "../../services/api";

const url = "https://api.omni.chat/v1/";
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

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridDensitySelector style={{ marginLeft: 5 }} />
//       <GridToolbarExport style={{ marginLeft: 30 }} />
//     </GridToolbarContainer>
//   );
// }

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
  btnRefresh: {
    color: "green",
  },
}));

export default function LogUsers(props) {
  const [query, setQuery] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dataCriacao, setDataCriacao] = useState(new Date());
  //   const [dataFim, setDataFim] = useState(new Date());

  const columns = [
    { field: "col1", headerName: "Teams ID", width: 120 },
    { field: "col2", headerName: "Nome", width: 150 },
    { field: "col3", headerName: "Status", width: 150 },
    { field: "col4", headerName: "Data Criação", width: 220 },
    { field: "col5", headerName: "Última atualização", width: 250 },
    { field: "col6", headerName: "Nome usuário", width: 300 },
    { field: "col7", headerName: "Telefone", width: 180 },
  ];

  useEffect(() => {
    setLoading(true);
    // const data_criacao = moment(dataCriacao).format("YYYY-MM-DD");
    // const dtfn = moment(dataFim).format("YYYY-MM-DD");
    console.log("init");
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
      const { data } = response;
      const results = data.map((row, index) => ({
        id: index,
        col1: row.objectId,
        col2: row.name,
      }));
      setQuery(results);
      setLoading(false);
      console.log(results);
    });

    // api.get("interactions").then((response) => {
    //   const { data } = response;
    //   const results = data.map((row, index) => ({
    //     id: index,
    //     col3: row.status,
    //     col4: moment(row.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
    //     col5: moment(row.updatedAt).format("DD/MM/YYYY - HH:mm:ss"),
    //     col6: row.chat.name,
    //     col7: `"("${row.customer.phoneAreaCode}")" ${row.customer.phoneNumber}`,
    //   }));
    //   setQuery(results);
    //   setLoading(false);
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCriacao]);

  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Title>Chats em espera</Title>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            label="Data de Criação"
            value={dataCriacao}
            onChange={(date) => setDataCriacao(date)}
            animateYearScrolling
            format="dd/MM/yyyy"
            id="din"
          />
          {/* <DatePicker
            label="Fim"
            value={dataFim}
            onChange={(date) => setDataFim(date)}
            animateYearScrolling
            format="dd/MM/yyyy"
            id="dfn"
          /> */}
        </MuiPickersUtilsProvider>
      </div>

      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          loading={loading}
          rows={query}
          columns={columns}
          pageSize={20}
          checkboxSelection
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            // Toolbar: CustomToolbar,
            Pagination: CustomPagination,
          }}
        />
      </div>
    </React.Fragment>
  );
}
