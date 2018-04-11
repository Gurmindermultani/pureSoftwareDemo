/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectUsername = () => createSelector(
  selectHome,
  (homeState) => homeState.get('username')
);

const makeSelectProducts = () => createSelector(
  selectHome,
  (homeState) => homeState.get('products')
);

const makeSelectCart = () => createSelector(
  selectHome,
  (homeState) => homeState.get('cart')
);

export {
  selectHome,
  makeSelectUsername,
  makeSelectProducts,
  makeSelectCart
};
