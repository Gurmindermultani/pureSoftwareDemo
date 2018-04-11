/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectCurrentUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentUser')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectCart = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('cart')
);

const makeSelectTotal = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('total')
);

const makeSelectPayable = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('payable')
);

const makeSelectDiscount = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('discount')
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectCart,
  makeSelectTotal,
  makeSelectPayable,
  makeSelectDiscount
};
