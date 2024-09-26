const Item = ({ id }) => {
  return <li>Item {id}</li>;
};

const content = (
  <div>
    <h1>Welcome to Mini React</h1>
    <p>This is a simple React app built with JSX.</p>
    <ul class="list" un onClick={() => console.log('Clicked')}>
      <Item id={1}></Item>
      <Item id={2}></Item>
      <Item id={3}></Item>
    </ul>
  </div>
);

MiniReact.render(content, document.getElementById('app'));

console.log(content);
