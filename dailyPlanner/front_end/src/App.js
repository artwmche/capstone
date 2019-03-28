import React, { Component } from 'react';
import logo from './logo.svg';
import Calendar from 'react-big-calendar'
import './styles/daily_planner.scss';
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactDOM from 'react-dom';
import moment from 'moment';
import Marquee from 'react-text-marquee';
import axios from 'axios';
import * as rssParser from 'react-native-rss-parser';
import { ReactAgenda , ReactAgendaCtrl , guid ,  Modal } from 'react-agenda';
import './App.css';
import PopupAddEventForm from './components/PopupAddEventForm';
import PopupAddRouteForm from './components/PopupAddRouteForm';
import PopupConfigForm from './components/PopupConfigForm';

require('moment/locale/en-ca.js');

const localizer = Calendar.momentLocalizer(moment) 

//remove later start
var colors= {
  'color-1': "BlanchedAlmond" ,
  "color-2": "DeepPink" ,
  "color-3": "DeepSkyBlue",	
  "color-4": "DimGray",	 	
  "color-5": "DimGrey",	 	
  "color-6": "DodgerBlue",	 	
  "color-7": "FireBrick",	 	
  "color-8": "FloralWhite",	 	
  "color-9": "ForestGreen",	 	
  "color-10": "Fuchsia",	 	
  "color-11": "Gainsboro",	 	
  "color-12": "GhostWhite",	 	
  "color-13": "Gold",	 	
  "color-14": "GoldenRod"
}
 
var now = new Date();
 




class App extends Component {
  constructor(props){
    super(props);
      this.state = {
        items:[],
        selected:[],
        cellHeight:30,
        showModal:false,
        locale:"en-ca",
        rowsPerHour:12,
        numberOfDays:4,
        startDate: new Date(),
        events: [],
        slideMenuActive : false,
        tickerQuotes: "",
        selectedDate: new Date(),
        cal_view : "month"
        
      }
      //this.handleCellSelection = this.handleCellSelection.bind(this)
      //this.handleItemEdit = this.handleItemEdit.bind(this)
      //this.handleRangeSelection = this.handleRangeSelection.bind(this)
      this.removeItemEvent = this.removeItemEvent.bind(this)
    }
   
  handleCellSelection(item){
    console.log('handleCellSelection',item)
  }
  handleItemEdit(item){
    console.log('handleItemEdit', item)
  }
  handleRangeSelection(item){
    console.log('handleRangeSelection', item)
  }

  removeItemEvent(items , item){

    console.log("remove item event:"+item._id);
    let body = {
      itemId : item._id
    }
    axios({
        method: 'post',
        url: 'http://localhost:8080/dailyPlanner/removeEvent',
        data: body,
        config: { headers:{'Content-Type':'application/json'}}
    })
    .then(result=>{
      this.allTask();
      //this.state.refreshList();
      //refresh agenda and calendar  
    })
    .catch(err=>{
        console.log(err);
    });
    
    //this.setState({ items:items});
}
  componentDidMount=()=>{
    axios.get('http://quotes.rest/qod.json')
    .then((response) => {
    console.log(response.data.contents.quotes[0].quote);
    this.setState({
      tickerQuotes : response.data.contents.quotes[0].quote
    })
    })
    .catch(err=>{
      console.log(err);
    });
    setInterval(this.getGoodMessage,(10 * 60 * 1000));
    /*this.setState({
      tickerQuotes :"Every day you have a choice to be honest or deceptive. If you commit to telling the truth, you will win. You’ll win more trust, you’ll win more business, and you’ll win more peace of mind. You’ll break the system and be even more successful."
    });*/
    this.allTask();
  }

  getGoodMessage=()=>{
    axios.get('http://quotes.rest/qod.json')
    .then((response) => {
    console.log(response.data.contents.quotes[0].quote);
    this.setState({
      tickerQuotes : response.data.contents.quotes[0].quote
    })
    })
    .catch(err=>{
      console.log(err);
    });
  }

  allTask=()=>{
    axios.get("http://localhost:8080/dailyPlanner/itemList").then(result=>{
      console.log(result.data);
      let itemList = [];
      let evtList = [];
      for(let i = 0; i < result.data.length ; i++){
        let item = {
          _id : result.data[i]._id,
          name : result.data[i].name,
          startDateTime : new Date(result.data[i].startDateTime),
          endDateTime : new Date(result.data[i].endDateTime),
          classes : result.data[i].classes,
        };
        itemList.push(item);
        let evt={
            start: new Date(result.data[i].startDateTime),
            end: new Date(result.data[i].endDateTime),
            title: result.data[i].name
        };
        evtList.push(evt);
      }
      this.setState({
        items : itemList,
        events : evtList
      });
    })
    .catch(err=>{
      console.log(err);
   })
  }
  render() {
    return (
        <div className="app__page">
          <div className="header-row">
            <div className="icons"><PopupAddEventForm parent={this}/>&nbsp;<PopupAddRouteForm parent={this}/>&nbsp;<PopupConfigForm/></div>
            <div className="ticker-size">
            <Marquee leading={2000} hoverToStop={true} loop={true} text={this.state.tickerQuotes} />
              </div>
          </div>
          <div className="main__layout">
              <div className="main__calendar">
                  <Calendar
                    localizer={localizer}
                    //defaultDate={new Date()}
                    //defaultView="month"
                    view={this.state.cal_view}
                    events={this.state.events}
                    date={this.state.selectedDate}
                    onNavigate={(date) => { this.setState({ selectedDate: date, cal_view: "month" }); console.log(this.state.selectedDate);}}
                  />
            </div>
            <div className="main__agenda">
              <ReactAgenda
                  minDate={this.state.selectedDate}
                  maxDate={new Date(this.state.selectedDate.getFullYear(), this.state.selectedDate.getMonth()+3)}
                  disablePrevButton={false}
                  startDate={this.state.selectedDate}
                  cellHeight={this.state.cellHeight}
                  locale={this.state.locale}
                  items={this.state.items}
                  numberOfDays={this.state.numberOfDays}
                  rowsPerHour={this.state.rowsPerHour}
                  itemColors={colors}
                  autoScale={false}
                  fixedHeader={true}
                  onItemRemove={this.removeItemEvent.bind(this)}/>
            </div>  
          </div>
        </div>
    );
  }
}

export default App;

/*
<ReactAgenda
            className="main__agenda"
            minDate={now}
            maxDate={new Date(now.getFullYear(), now.getMonth()+3)}
            disablePrevButton={false}
            startDate={this.state.startDate}
            cellHeight={this.state.cellHeight}
            locale={this.state.locale}
            items={this.state.items}
            numberOfDays={this.state.numberOfDays}
            rowsPerHour={this.state.rowsPerHour}
            itemColors={colors}
            autoScale={false}
            fixedHeader={true}
            onItemEdit={this.handleItemEdit.bind(this)}
            onCellSelect={this.handleCellSelection.bind(this)}
            onRangeSelection={this.handleRangeSelection.bind(this)}/>

            */
