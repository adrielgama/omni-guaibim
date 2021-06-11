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
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

// import api from "../../services/api";

const url = "https://cors-anywhere.herokuapp.com/https://api.omni.chat/v1/";
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

// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridDensitySelector style={{ marginLeft: 5 }} />
//       <GridToolbarExport style={{ marginLeft: 30 }} />
//     </GridToolbarContainer>
//   );
// }

// export const RowData = () => {

//   // console.log(data);
// };

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
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idTeam, setIdTeam] = useState([]);

  const [team, setTeam] = useState([]);

  const [dataCriacao, setDataCriacao] = useState(new Date());

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

  console.log(team);
  console.log(idTeam);

  const columns = [
    { field: "col1", headerName: "Teams ID", width: 150 },
    { field: "col2", headerName: "Nome", width: 220 },
    { field: "col3", headerName: "Status", width: 150 },
    { field: "col4", headerName: "Data Criação", width: 220 },
    { field: "col5", headerName: "Última atualização", width: 250 },
    { field: "col6", headerName: "Nome usuário", width: 220 },
    { field: "col7", headerName: "Telefone", width: 180 },
  ];

  useEffect(() => {
    setLoading(true);
    console.log("interactions");
    axios({
      method: "GET",
      url: `${url}interactions?limit=100`,
      headers: {
        "x-api-key": publicKey,
        "x-api-secret": privateKey,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      // mode: "no-cors",
    }).then((res) => {
      const { data } = res;
      const results = data
        .filter((stts) => stts.status === "WAITING")
        .map((row, index) => ({
          id: index,
          col1: row.botFowardedToTeam, // o valor é o mesmo do chat>team>objectId,
          col2:
            idTeam.id ===
            team.map((elem) => ({
              id: elem.id,
            }))
              ? idTeam.map((n) => ({
                  id: n.name,
                }))
              : "teste else",
          col3: row.status,
          col4: moment(row.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
          col5: moment(row.updatedAt).format("DD/MM/YYYY - HH:mm:ss"),
          col6: row.chat.name,
          col7: row.chat.platformId, //numero de telefone do cliente
          onlySetID: setIdTeam(row.botFowardedToTeam),
        }));

      console.log(results);

      setInteractions(results);
      setLoading(false);
    });

    // console.log(interactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCriacao]);

  // console.log(RowData);
  // console.log(teams);
  // console.log(interactions);
  // console.log(idTeam);

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
        </MuiPickersUtilsProvider>
      </div>

      <div style={{ height: 450, width: "100%" }}>
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
          // filterModel={{
          //   items: [
          //     {
          //       columnField: "col3",
          //       operatorValue: "contains",
          //       value: "waiting",
          //     },
          //   ],
          // }}
        />
      </div>
    </React.Fragment>
  );
}
