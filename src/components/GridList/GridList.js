import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import Title from "./Title";

import {
  DataGrid,
  GridOverlay,
  useGridSlotComponentProps,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";

import Pagination from "@material-ui/lab/Pagination";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

import { InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import LinkIcon from "@material-ui/icons/Link";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

const url = "https://cors-anywhere.herokuapp.com/https://api.omni.chat/v1/"; //usar este para localhost
// const url = "https://thingproxy.freeboard.io/fetch/https://api.omni.chat/v1/";
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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
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
  dropDown: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    color: "#9e9e9e",
  },
  span: {
    fontSize: 14,
    marginRight: 10,
  },
  iconBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#9e9e9e",
  },
}));

export default function LogUsers() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [team, setTeam] = useState([]);
  const [dataCriacao, setDataCriacao] = useState(new Date());
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("WAITING");

  const columns = [
    // { field: "col1", headerName: "Teams ID", width: 150 },
    { field: "col9", headerName: "Nome Atendente", width: 320 },
    { field: "col2", headerName: "Nome Time", width: 320 },
    {
      field: "col3",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div index={params.row.id}>
            {params.value === "FINISHED" ? (
              <div className={classes.iconBtn}>
                <span className={classes.span}>Finalizado</span>
                <DoneAllIcon style={{ color: "#ff4569" }} />
              </div>
            ) : params.value === "CONTACTED" ? (
              <div className={classes.iconBtn}>
                <span className={classes.span}>Contactado</span>
                <LinkIcon style={{ color: "#1dd355" }} />
              </div>
            ) : (
              <div className={classes.iconBtn}>
                <span className={classes.span}>Aguardando</span>
                <HourglassEmptyIcon style={{ color: "#ff9c06" }} />
              </div>
            )}
          </div>
        );
      },
    },
    { field: "col4", headerName: "Data Criação", type: "date", width: 220 },
    {
      field: "col5",
      headerName: "Última atualização",
      // type: "dateTime",
      width: 220,
    },
    {
      field: "col10",
      headerName: "Abertura / Atualização",
      type: "dateTime",
      width: 220,
    },
    { field: "col6", headerName: "Nome usuário", width: 220 },
    { field: "col7", headerName: "Telefone", width: 180 },
    {
      field: "col8",
      headerName: "CreateDate",
      type: "date",
      width: 220,
      hide: true,
    },

    { field: "col20", headerName: "CreateDate", width: 220, hide: true },
    { field: "col21", headerName: "CreateDate", width: 220, hide: true },
    { field: "col22", headerName: "CreateDate", width: 220, hide: true },
  ];

  useEffect(() => {
    setLoading(true);
    axios({
      method: "GET",
      url: `${url}chats?limit=120`,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "x-api-key": publicKey,
        "x-api-secret": privateKey,
        "Content-Type": "application/json",
      },
      // mode: "cors",
      //att
    }).then((res) => {
      const { data } = res;
      console.log(data);
      const results = data
        .filter((stts) => stts.status === status)
        .map((row, index) => ({
          id: index,
          // col1: row.team.objectId,
          col9: row.user !== null ? row.user.name : "Atendente virtual",
          //TODO: tratamento do ELSE /team
          col2: row.team ? row.team.name : "Sem time ainda",
          // col2: team
          //   // eslint-disable-next-line
          //   .map((elem) => {
          //     if (elem.id === row.botFowardedToTeam) {
          //       // console.log(elem.name);
          //       return elem.name;
          //     }
          //   })
          //   .filter((elem) => {
          //     return elem !== undefined;
          //   }),
          col3: row.status,
          col4: moment(row.createdAt).format("DD/MM/YYYY - HH:mm:ss"),
          col5: moment(row.updatedAt).format("DD/MM/YYYY - HH:mm:ss"),
          // col10: (moment(row.createdAt, "DD/MM/YYYY HH:mm:ss").diff(moment(row.updatedAt, "DD/MM/YYYY HH:mm:ss"))),
          col6: row.name,
          col7: `(${row.customer.phoneAreaCode}) ${row.customer.phoneNumber} `,
          col8: row.createdAt,

          col10:
            moment
              .duration(moment(row.updatedAt).diff(moment(row.createdAt)))
              .get("hours") +
            ":" +
            moment
              .duration(moment(row.updatedAt).diff(moment(row.createdAt)))
              .get("minutes") +
            ":" +
            moment
              .duration(moment(row.updatedAt).diff(moment(row.createdAt)))
              .get("seconds") +
            " h",
        }));
      setInteractions(results);
      setCount(results.length);
      setLoading(false);

      console.log(results);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCriacao, status]);

  // useEffect(() => {
  //   axios({
  //     method: "GET",
  //     url: `${url}teams`,
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods":
  //         "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  //       "x-api-key": publicKey,
  //       "x-api-secret": privateKey,
  //       "Content-Type": "application/json",
  //     },
  //   }).then((response) => {
  //     const { data } = response;
  //     const results = data.map((row) => ({
  //       id: row.objectId,
  //       name: row.name,
  //     }));
  //     setTeam(results);
  //   });
  // }, []);

  const classes = useStyles();

  function refreshPage() {
    setInterval(() => {
      window.location.reload();
    }, 600000);
  }

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Title>Chats em espera</Title>
        <div className={classes.waiting}>
          <p style={{ color: "#696868" }}>Chamados em espera: </p>
          <h3 style={{ marginLeft: 5, color: "#3c3c3b" }}> {count}</h3>
        </div>

        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            onChange={handleChange}
            className={classes.dropDown}
          >
            <MenuItem value={"FINISHED"}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <DoneAllIcon style={{ color: "#ff4569", marginRight: 10 }} />
                Finalizado
              </div>
            </MenuItem>
            <MenuItem value={"CONTACTED"}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <LinkIcon style={{ color: "#1dd355", marginRight: 10 }} />
                Contactado
              </div>
            </MenuItem>
            <MenuItem value={"WAITING"}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <HourglassEmptyIcon
                  style={{ color: "#ff9c06", marginRight: 10 }}
                />
                Aguardando
              </div>
            </MenuItem>
          </Select>
        </FormControl>

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

      <div style={{ height: 620, width: "100%" }}>
        {refreshPage()}
        <DataGrid
          loading={loading}
          rows={interactions}
          columns={columns}
          pageSize={20}
          checkboxSelection
          components={{
            LoadingOverlay: CustomLoadingOverlay,
            Toolbar: CustomToolbar,
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
