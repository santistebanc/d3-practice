import React from 'react';
import ReactDOM from 'react-dom';
import PieChart from './PieChart.jsx';

let mydata = [{name: "Germany", population: 80.62},
             {name: "France", population: 66.03},
             {name: "USA", population: 318.9},
             {name: "Serbia", population: 7.164},
             {name: "India", population: 1252},
             {name: "Mexico", population: 122.3}];


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {datastate: mydata}
  }
  handleClick(){
    this.state.datastate[4].population -= 100;
    this.setState({datastate: this.state.datastate});
    this.forceUpdate();
  }
  render () {
    return <div><p> Hello React!</p><PieChart data={this.state.datastate} title={"Populations"}/><button onClick={this.handleClick.bind(this)}>change data</button></div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
