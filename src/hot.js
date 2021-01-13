import '../public/index.html';
import template from './App.njk';
import morphdom from 'morphdom';

const App = document.getElementById('app');
App.innerHTML = template;

if (module.hot) {
  module.hot.accept('./App.njk', () => {
    const clone = App.cloneNode();
    clone.innerHTML = template;
    morphdom(App, clone);
  });
}
