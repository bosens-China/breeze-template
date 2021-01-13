import '../public/index.html';
import template from './App.njk';
import morphdom from 'morphdom';

const App = document.getElementById('app') as HTMLDivElement;
App.innerHTML = template;

if (module.hot) {
  module.hot.accept('./App.njk', () => {
    const clone = App.cloneNode() as HTMLDivElement;
    clone.innerHTML = template;
    morphdom(App, clone);
  });
}
