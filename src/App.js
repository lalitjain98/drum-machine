import React, {Component, Fragment} from 'react';
import './App.css';
import './store/data';
import {bankOne, bankTwo} from "./store/data";


class Button extends React.Component{
  constructor(props){
    super(props);
    this.reference = React.createRef();
  }

  componentDidMount() {
    console.log(this.reference);
  }

  render() {
    let {data, disabled, playAudio} = this.props;
    return (
      <button
        id={data.keyCode}
        className="drum-pad"
        disabled={disabled} style={{
          padding: "1vmin",
          margin: "1vmin",
          minHeight: "10vmin",
          minWidth: "10vmin",
          color: "white",
          fontSize: "2em",
          backgroundImage: "linear-gradient(to bottom right, #372657, #3726d7)",
          borderRadius: "0.5em",
          boxShadow: "5px 5px 20px 0px black"
        }}
        onClick={() => { this.reference.current.play(); playAudio(data)}}>
        <audio src={data.url} id={data.keyTrigger} className="clip" ref={this.reference}/>
        {data.keyTrigger}
      </button>
    );
  }
}

export const Switch = (props) => {
  return (
    <div style={{display: "flex", padding: "1em", alignItems: "center"}}>
      <input checked={props.value} disabled={props.disabled} name={props.name} type="checkbox" onChange={(e)=>props.onChange(props.name, e)} value={props.value}/>
      <label>{props.title}</label>
    </div>
  );
};

export const SwitchA = (props) => {
  return (
    <div style={{ display: "flex", padding: "1em", alignItems: "center"}}>
      <button style={props.styles} disabled={props.disabled} onClick={(e)=>props.onChange(props.name, e)}>{props.title}</button>
    </div>
  );
};

export const Slider = (props) => {
  return (
    <div style={{display: "flex", padding: "1em", flexDirection: "column"}}>
      <input name="volume" min="0" max="100" type="range" onChange={(e)=>props.onChange(e)} value={props.value}/>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <div>0</div>
        <div>100</div>
      </div>
    </div>
  );
};

export const Text = (props) => (<div id={props.id} style={{
    ...props.styles,
    padding: "0.1vmin 1vmin",
    minHeight: "5vmin",
    backgroundImage: "linear-gradient(to bottom right, #aaa, #eee)",
    borderRadius: "0.5vmin",
    width: "40vmin",
    // boxShadow: "2px 2px 10px 0px black",
    // color: "#ff0",
    fontSize: "1.5em",
    alignText: "center",
    justifyContent: "center",
    alignItems: "center",
    display: 'flex',
    alignSelf: "center",
    border: "2px inset #555"
  }}>
    <div>
      {props.value?props.value:" "}
    </div>

  </div>);

class App extends Component {

  constructor(props){
    super(props);
    let audios = {};

    for(let i in bankOne) {
      let item = bankOne[i];
      audios[item.id] = new Audio(item.url);
    }
    for(let i in bankTwo) {
      let item = bankTwo[i];
      audios[item.id] = new Audio(item.url);
    }

    this.state = {
      currentItem: "",
      power: true,
      bank: true,
      bankOne: bankOne,
      bankTwo: bankTwo,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      volume: 100
    };
    this.handleKey = this.handleKey.bind(this);
    this.setWindowDimensions = this.setWindowDimensions.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKey);
    window.addEventListener("resize", this.setWindowDimensions);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKey);
    window.removeEventListener("resize", this.setWindowDimensions);
  }

  toggle(key){
    // console.log(key);
    this.setState((state)=>{
      let currentItem = state.currentItem;
      if (key === "power") {
        currentItem = "";
      } else if (key === "bank" && !state.bank) {
        currentItem = "Heater Kit";
      } else if (key === "bank" && state.bank) {
        currentItem = "Smooth Piano Kit";
      }
      return{
        ...state,
        [key]: !state[key],
        currentItem: currentItem
      }
    });

  }

  playAudio(item) {
    // console.log(item, this.state.audios);
    // console.log(this.state.audios[item.id]);
    // console.log(item);
    this.setState({currentItem: item.id});
  }

  handleKey(e) {
    // console.log(e);
    if(!this.state.power){
      return;
    }
    let allowed = "qweasdzxc";
    if(allowed.indexOf(e.key.toLowerCase()) > -1){
      let bank = this.state.bank ? this.state.bankOne : this.state.bankTwo;
      let item = null;
      for(let i in bank){
        if(bank[i].keyTrigger.toLowerCase() === e.key.toLowerCase()){
          item = bank[i];
          break;
        }
      }
      if(item){
        // console.log(item);
        let audio = document.getElementById(item.keyTrigger);
        audio.volume = this.state.volume/100;
        audio.play();
        this.playAudio(item);
      }
    }
  }

  setWindowDimensions() {
    this.setState((state)=>{
      return {
        ...state,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      }
    });
  }

  changeVolume(e) {
    console.log(e);
    e.preventDefault();
    let volume = e.target.value;
    this.setState((state)=>{
      return {
        ...state,
        volume: volume,
        currentItem: `Volume ${volume}`
      }
    });
  }

  render() {
    let bank = this.state.bank ? this.state.bankOne : this.state.bankTwo;
    let buttons = (
      <div style={{display: "grid", gridTemplateColumns: "auto auto auto", gridGap: "0"}}>
        {
          bank.map((item, index)=>(
            <Button disabled={!this.state.power} data={item} key={index} playAudio={(item)=>this.playAudio(item)}/>
          ))
        }
      </div>
    );
    return (
      <Fragment>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh"}}>
        <div style={{margin: "auto"}}>
          <div style={{color: "#555", fontSize: "10vmin"}}>Drum Machine</div>
        </div>
        <div id="drum-machine" style={{padding: "1em", margin: "auto", display: "flex", flexDirection: (this.state.windowWidth <= 768 ? "column" : "row"), alignSelf: "center", alignItems: "center", justifyContent: "center", border: "2px solid #555"}}>
          <div style={{width: "100%"}}>
            {buttons}
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "5vmin", width: "100%"}}>
            <Text id="display" value={this.state.currentItem} styles={{minWidth: "40vmin", fontFamily: "Monospace", textTransform: "uppercase"}}/>
            <SwitchA
              disabled={!this.state.power}
              name="bank"
              value={this.state.bank}
              title={"Bank"}
              // title={this.state.bank?"Heater Kit":"Smooth Piano Kit"}
              styles={{
                color: "white",
                border: (this.state.bank? "green" : "purple"),
                width: "100%",
                height: "5vmin",
                backgroundImage: (this.state.bank? "linear-gradient(to bottom right, #372657, #3726d7)" : "linear-gradient(to bottom right, #3726d7, #372657)"),
                boxShadow: "0 0 10px 0px #555",
                borderRadius: "1vmin"
              }}
              onChange={(name)=>this.toggle(name)}/>

            {/*linear-gradient(to bottom right, #372657, #3726d7)*/}

            <Slider value={this.state.volume} onChange={(e)=>this.changeVolume(e)}/>
            <SwitchA
              name="power"
              value={this.state.power}
              title={`Power ${this.state.power ? "ON" : "OFF"}`}
              styles={{
                color: "white",
                // border: (this.state.power? "green" : "purple"),
                width: "100%",
                height: "5vmin",
                boxShadow: "0 0 5px 0px #555",
                borderRadius: "1vmin",
                backgroundImage: (this.state.power? "linear-gradient(to right, #00c853, #4caf50)" : "linear-gradient(to right, #d50000, #ef5350)")
              }}
              onChange={(name)=>this.toggle(name)}/>
          </div>
        </div>
      </div>
      <footer style={{textAlign: "center",padding: "1.25em 1em", borderTop: "1px solid black", fontSize: "1.25em"}}>
        Link to github repo: <a style={{textDecoration: "none", color: "blue"}} href="https://github.com/lalitjain98/drum-machine" rel="noopener noreferrer" target="_blank">github.com/lalitjain98/drum-machine</a>
      </footer>
      </Fragment>
    );
  }


}

export default App;
