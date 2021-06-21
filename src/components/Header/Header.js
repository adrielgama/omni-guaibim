import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  toolbar: {
    backgroundColor: "#3c3c3b",
    // color: "#fdc802",
    // textTransform: "uppercase",
  },

  title1: {
    color: "#fdc802",
  },
  title2: {
    color: "#fff",
  },
  
}));

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography variant="h5" className={classes.title1}>
            Omni
          </Typography>
          <Typography variant="h5" className={classes.title2}>
            Chat
          </Typography>
        </Toolbar>
        <Link
          href="https://cors-anywhere.herokuapp.com/https://api.omni.chat/v1/"
          color="inherit"
          target="_blank"
        >
          <div className={classes.redirect}>
            <Typography>
              Caso os dados não carreguem
              <strong> CLIQUE AQUI </strong>
              acione o botão que irá aparecer, depois retorne a essa página e atualize ela.
            </Typography>
          </div>
        </Link>
      </AppBar>
    </div>
  );
};

export default Header;
