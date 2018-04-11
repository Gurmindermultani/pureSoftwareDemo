import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectCart,makeSelectTotal,makeSelectDiscount,makeSelectPayable } from 'containers/App/selectors';
import { applyCodeAction } from 'containers/App/actions';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from 'material-ui/Switch';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Menu, { MenuItem } from 'material-ui/Menu';
import Badge from 'material-ui/Badge';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Button from 'material-ui/Button';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';




const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  pointer : {
    cursor : "pointer"
  },
  listRoot: {
    minWidth: 500,
    maxWidth: 500,
  },
   table: {
    minWidth: 500,
    maxWidth: 500,
  },
  price : {
    float : "right"
  }
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
    open: false,
    couponCode : ""
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleInputChange = name => event => {
    this.setState({couponCode : event.target.value});
  };

  applyCode = () => {
    this.props.applyCodeAction(this.state.couponCode,this.props.cart);
  }

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);
    var number = this.props.cart.length ? this.props.cart.length : 0;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              PureSoftware Demo
            </Typography>
            {auth && (
              <div>
                <Badge
                  badgeContent={number}
                >
                  <ShoppingCart className={classes.pointer} onClick={this.handleClickOpen} />
                </Badge>
                <Dialog
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"User's Cart?"}</DialogTitle>
                  <DialogContent>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell numeric>quantity</TableCell>
                          <TableCell numeric>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.props.cart.map(n => {
                          return (
                            <TableRow key={n._id}>
                              <TableCell>{n.name}</TableCell>
                              <TableCell numeric>{n.quantity}</TableCell>
                              <TableCell numeric>{n.price}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <Typography variant="subheading" color="inherit" className={classes.price}>
                      Price : {this.props.total}
                    </Typography>
                    <TextField
                      id="with-placeholder"
                      label="Coupon Code"
                      placeholder="Coupon Code"
                      className={classes.textField}
                      margin="normal"
                      onChange={this.handleInputChange()}
                    />
                    <Button onClick={this.applyCode}  variant="raised" color="primary" autoFocus>
                      Apply Code
                    </Button>
                    {this.props.discount && (
                      <div>
                        <br/>
                        <Typography variant="subheading" color="inherit" className={classes.price}>
                          Discount : -{this.props.discount}
                        </Typography>
                        <br/>
                        <Typography variant="subheading" color="inherit" className={classes.price}>
                          Amount Payable : {this.props.payable}
                        </Typography>
                      </div>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button variant="raised" color="primary" autoFocus>
                      PAY
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    applyCodeAction: (coupon,cart) => {
      dispatch(applyCodeAction(coupon,cart));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  cart : makeSelectCart(),
  total : makeSelectTotal(),
  discount : makeSelectDiscount(),
  payable : makeSelectPayable()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  withStyles(styles)
)(MenuAppBar);