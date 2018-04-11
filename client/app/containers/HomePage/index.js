/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError,makeSelectCart } from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos,loadProducts } from '../App/actions';
import { changeUsername,addToCart } from './actions';
import { makeSelectUsername,makeSelectProducts } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';

const styles = {
  root: {
    padding : "2em"
  },
  card: {
    maxWidth: 250,
    minWidth: 250,
    display : "inline-block",
    marginLeft : 20
  },
  media: {
    height: 200,
  },
};

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial data
   */
  state = {
    open: false,
    vertical: "bottom",
    horizontal: "center",
  };
  componentWillMount() {
    this.props.loadProducts();
  }

  addToCart(product){
    this.setState({ open: true });
    var that = this;
    product.quantity = 1;
    var productFound = false;
    var cart  = Object.assign([],this.props.cart);
    cart.forEach(function(cartProduct){
      if(cartProduct._id === product._id){
        cartProduct.quantity = cartProduct.quantity + 1;
        productFound = true;
      }
    });
    if(!productFound){
      cart.push(product);
    }
    this.props.addToCart(cart);
    setTimeout(function(){
      that.setState({ open: false });
    },1000);
  }
  handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };
  render() {
    var that = this;
    const { classes } = this.props;
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };
    const { vertical, horizontal, open } = this.state;
    return (
      <article>
        <Helmet>
          <title>Pure Software Demo</title>
          <meta name="description" content="Pure Software Demo" />
        </Helmet>
        <div className={classes.root}>
          {this.props.products.map((product) => 
            <Card key={product.name} className={classes.card}>
              <CardMedia
                className={classes.media}
                image="https://material-ui-next.com/static/images/cards/contemplative-reptile.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  {product.name}
                </Typography>
                <Typography component="p">
                  Price : {product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={this.addToCart.bind(that,product)}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          )}
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={this.handleCloseSnack}
            SnackbarContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Added To Cart</span>}
          />
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    loadProducts: () => {
      dispatch(loadProducts());
    },
    addToCart: (cart) => {
      dispatch(addToCart(cart));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  products: makeSelectProducts(),
  cart : makeSelectCart()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles)
)(HomePage);
