import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

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
      </AppBar>
    </div>
  );
};

export default Header;
