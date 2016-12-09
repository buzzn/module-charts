[ ![Codeship Status for buzzn/module-charts](https://app.codeship.com/projects/5756b3f0-a02b-0134-1660-620e497cce73/status?branch=master)](https://app.codeship.com/projects/189631)
# module-charts

To run local dev server:
- clone this repository
- install node.js 6.xx
- run `sudo npm i -g yarn webpack`
- run `yarn`
- run `yarn run dev-server`
- open in browser `http://localhost:2999`

To run tests:
- run `sudo npm i -g mocha`
- run `yarn run test`

How to build automatically on codeship:
- setup commands:
```
nvm install 6.7.0
npm cache clean
npm i -g yarn cross-env rimraf
yarn
npm rebuild node-sass
```
- test pipeline commands:
```
yarn run test
yarn run build
```

To use linter:
- install eslint globally `sudo npm i -g eslint`
- add eslint plugin to your favorite editor

How to use this module in app:
- add it as a dependency in package.json (replace v1.0.0 with required tag):
```
"@buzzn/module_charts": "git+https://github.com/buzzn/module-charts.git#v1.0.0"
```
- add Charts reducers to app reducers:
```
import { combineReducers } from 'redux';
import Charts from '@buzzn/module_charts';

export default combineReducers({
  bubbles: Charts.reducers,
});
```
- run Charts saga in saga middleware:
```
import Charts from '@buzzn/module_charts';
import appSaga from './sagas';

function* rootSaga() {
  yield [call(Charts.sagas), call(appSaga)];
}
// ...
// store configuration
  sagaMiddleware.run(rootSaga);
// ...
```
- mount charts component in react UI:
```
import Charts from '@buzzn/module_charts';
// ...
// somewhere in UI
<Charts.chart />
// ...
```
- dispatch setGroup action with groupId:
```
Charts.actions.setGroup(group)
```
- this module relies on config part of a redux state. (should be changed)