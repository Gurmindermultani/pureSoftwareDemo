/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_REPOS } from 'containers/App/constants';
import { productsLoaded, repoLoadingError,cartLoaded } from 'containers/App/actions';
import { addToCart } from './actions';

import request from 'utils/request';
import { makeSelectUsername } from 'containers/HomePage/selectors';

/**
 * Github repos request/response handler
 */
export function* getProducts() {
  // Select username from store
  const requestURL = `http://localhost:3000/products`;

  try {
    // Call our request helper (see 'utils/request')
    const products = yield call(request, requestURL);
    yield put(productsLoaded(products));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

export function* addToCartCall(product) {
  // Select username from store
  const requestURL = `http://localhost:3000/cart/update`;
  try {
    // Call our request helper (see 'utils/request')
    const cart = yield call(request, requestURL,{
      body: JSON.stringify({
        items : product.cart
      }), // must match 'Content-Type' header
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
    });
    yield put(cartLoaded(cart));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

export function* couponCall(action) {
  // Select username from store
  const requestURL = `http://localhost:3000/cart/apply-coupon`;
  try {
    // Call our request helper (see 'utils/request')
    const cart = yield call(request, requestURL,{
      body: JSON.stringify({
        items : action.cart,
        couponCode : action.coupon
      }), // must match 'Content-Type' header
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
    });
    yield put(cartLoaded(cart));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest("LOAD_PRODUCTS", getProducts);
  yield takeLatest("ADD_TO_CART", addToCartCall);
  yield takeLatest("APPLY_COUPON", couponCall);
}
