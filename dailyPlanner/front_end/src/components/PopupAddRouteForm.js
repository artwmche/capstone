import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import axios from 'axios';
import GooMap from './GooMap';

export default class PopupAddRouteForm extends Component {

    constructor(props){
        super(props);
        //this._isMounted = false;
        this.state={
            //keepOpen : false,
            //inventorylist : [],
            open : false,
            checked : true,
            stock_status: "In Stock",
            //refreshList : this.props.refreshList,
            errMessage : [],
            eventList : [],
            routeList : [],
            route_start : "",
            route_end : "",
            route_waypoints : [],
            mapDirService : {},
            mapDirDisplay : {},
            transitLegs : [],
            parentPage : props.parent


        };
        //this.handleChange = this.handleChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
      }
    

    openModal=()=>{
      this.setState({open:true,errMessage:[]});
      this.setState({
        route_start : [],
        route_end : [],
        route_waypoints : [],
        eventList : [],
        routeList : [],
      });
    }  
    closeModal=()=>{
      this.setState({
        route_start : [],
        route_end : [],
        route_waypoints : [],
        eventList : [],
        routeList : [],
      });
      this.setState({open:false});
    }

    addItem=(event)=>{
      event.preventDefault();
      let newEvent = {
        eventTitle : event.target.eventTitle.value,
        stayTimeInHours : event.target.stayTimeInHours.value,
        stayTimeInMins : event.target.stayTimeInMins.value,
        fulladdress : event.target.fulladdress.value,
        desc : event.target.desc.value
      };

      let eventList = this.state.eventList;
      eventList.push(newEvent);

      //add the event to the selected
      this.setState({
          eventList
      });
      event.target.desc.value="";
      event.target.eventTitle.value="";
      event.target.fulladdress.value="";

    }

    selectedAddress=(event)=>{
      event.preventDefault();
      let index = event.target.selectedIndex;
      console.log("select index:"+index);
      let routeList = this.state.routeList;
      let eventList = this.state.eventList;
      routeList.push(eventList[index].fulladdress);
      this.setState({
        routeList
      });
      routeList = this.state.routeList;
      if(routeList.length>0){
        //console.log("Iam here");
        this.setState({
          route_start : routeList[0]
        });
      }
      if(routeList.length>=2){
        //console.log("iam here2");
        this.setState({
          route_end : routeList[routeList.length-1]
        })
      }
      if(routeList.length>=3){
        //console.log("I am here3");
        let list = routeList.slice(1,(routeList.length - 1));
        console.log("route size:"+ list.length);
        this.setState({
          route_waypoints : list
        });
      }
      
    }

    componentDidMount=()=>{
      
    }
    clearRoute=(event)=>{
      event.preventDefault();
      this.setState({
        route_start : [],
        route_end : [],
        route_waypoints : [],
        eventList : [],
        routeList : [],
      })
    }

    calculateRoute=(event)=>{
      event.preventDefault();
      let waypoints = [];
      for(let i = 0 ; i < this.state.route_waypoints.length; i++){
        waypoints.push({
          location: this.state.route_waypoints[i],
          stopover: true
        })
      }

      this.state.mapDirService.route({
        origin : this.state.route_start,
        destination : this.state.route_end,
        waypoints : waypoints,
        optimizeWaypoints: true,
        travelMode : 'DRIVING'
      },(response, status)=>{
        if(status === 'OK'){
          this.state.mapDirDisplay.setDirections(response);
          //get the time duration which is an event
          //COUNT THE NUMBER OF LEG
          console.log("num of leg: " + response.routes[0].legs.length);
          //response.routes[0].legs[]
          for(let i = 0; i < response.routes[0].legs.length ; i++){
            this.setState({
              transitLegs : response.routes[0].legs
            })
            console.log("duration:"+response.routes[0].legs[i].duration.value);
            console.log("duration:"+response.routes[0].legs[i].duration.text);
          }
        }
        else{
          alert('Directions request failed due to ' + status);
          console.log('Directions request failed due to ' + status);
        }
      })
    }

    addRouteEvent=(event)=>{
        event.preventDefault();
        //console.log("add Item stock status:" + this.state.checked);
        let startTime = new Date(event.target.startTime.value);
        let millisec = startTime.getTime();
        millisec = millisec + ( this.state.eventList[0].stayTimeInHours * 60 * 60 * 1000) + 
        ( this.state.eventList[0].stayTimeInMins * 60 * 1000) ;
        let endTime = new Date();
        endTime.setTime(millisec);
        console.log(endTime.toDateString());
        let events = [];
        let startEvent = {
          eventTitle : this.state.eventList[0].eventTitle,
          startTime : startTime,
          endTime : endTime,
          fulladdress : this.state.eventList[0].fulladdress,
          desc : this.state.eventList[0].desc
        };
        
        events.push(startEvent);
        let startTime1 = new Date(endTime.getTime());
        let endTime1 = null;
        let startTime2 = null;
        let endTime2 = null;
        for( let i = 0 ; this.state.transitLegs.length > i;i++){
          let dSecs = this.state.transitLegs[i].duration.value;// set time
          console.log(startTime1.toDateString());
          let aTime = startTime1.getTime() + ( dSecs * 1000);
          console.log("1:"+aTime);
          endTime1 = new Date(aTime);
          
          console.log(endTime1.getTime());
          let trasitEvent = {
            eventTitle : "In transit event",
            startTime : startTime1,
            endTime : endTime1,
            fulladdress : "N/A",
            desc : "In transit"
            
          }
          events.push(trasitEvent);
          startTime2 = new Date(endTime1.getTime());
          
          console.log(startTime2.toDateString());
          endTime2 = new Date(startTime2.getTime() + ( this.state.eventList[0].stayTimeInHours * 60 * 60 * 1000) + 
          ( this.state.eventList[0].stayTimeInMins * 60 * 1000) );
          
          
          console.log(endTime2.toDateString());
          let routeEvent = {
            eventTitle : this.state.eventList[i+1].eventTitle,
            startTime : startTime2,
            endTime : endTime2,
            fulladdress : this.state.eventList[i+1].fulladdress,
            desc : this.state.eventList[i+1].desc
          }
          events.push(routeEvent);
          startTime1 = new Date(endTime2.getTime());
          
        }
          //console.log(body);
          let body = {
            events : events
          }
          axios({
              method: 'post',
              url: 'http://localhost:8080/dailyPlanner/addRouteEventList',
              data: body,
              config: { headers:{'Content-Type':'application/json'}}
          })
          .then(result=>{

            this.setState({
              route_start : [],
              route_end : [],
              route_waypoints : [],
              eventList : [],
              routeList : [],
            });

            this.setState({open:false});
            
            this.state.parentPage.allTask();
            //this.state.refreshList();
            //refresh agenda and calendar  
          })
          .catch(err=>{
              console.log(err);
          });
         
    }
    

   
  render() {
    
    return (
      <div>
      <button onClick={this.openModal}  className="general__button">Add Route</button>
        <Popup 
        modal
        open = {this.state.open}
        defaultOpen={false}
        contentStyle={{width:'auto',height:'auto'}}
        onClose={this.closeModal}
        
        >
          <div className="dp__add__form__layout--2">
            
            <div className="dp__add__header--2"><h1>Create New Route Event</h1></div>
              <div className="dp">
                <label>{this.state.errMessage}</label>
              </div>
              <div className="add__route_panels">
                <div className="route__panel">
                    <div id="right-panel">
                    <form onSubmit={this.addRouteEvent}>
                      <div>
                          <div className="dp__add__item">
                              <label className="dp__add__label"><b>Start Time</b></label>
                              <input name="startTime" type="datetime-local" className="dp__add__entry--text" />
                          </div>  
                          <div className="dp__add__item">
                            <b>Locations:</b> <br/>
                            <select name="addressList" id="route_locations" size="10" className="dp__add__entry--selection" onChange={this.selectedAddress}>
                            {
                                this.state.eventList.map((item,index) => {
                                    return (
                                        <option key={item.fulladdress+index} value={item.fulladdress}>
                                            {item.fulladdress}
                                        </option>
                                    )
                                })
                            }
                            </select>
                          </div>
                        
                      </div>
                      <div className="dp__add__item">
                        <div className="flex__vertical_layout"><div><b>Start</b></div><div className="flex__vertical_layout">{this.state.route_start}</div></div>
                        <div className="flex__vertical_layout"><div><b>Waypoints</b></div><div className="flex__vertical_layout">{this.state.route_waypoints.map((item)=>{
                          return (<div>{item}</div>)
                        })}</div></div>
                        <div className="flex__vertical_layout"><div><b>End</b></div><div className="flex__vertical_layout">{this.state.route_end}</div></div>
                        <button className="general__button" onClick={this.clearRoute}>Clear</button>
                        <br/>
                          <button id="Calculate" onClick={this.calculateRoute} className="general__button">Calculate</button>
                          <button type="submit"  className="general__button">Add Route Event</button>
                      </div>
                      <div id="directions-panel" className="dp__add__item"></div>
                      </form>
                    </div>
                    <div id="map_layout"><GooMap id="googlemap" parentInstance={this}/></div>
                  <div className="route_event_layout">
                    <form onSubmit={this.addItem}>
                    <div className="dp__add__label--2"><b>Route Event</b></div>
                    <div className="dp__add__errMessage">
                      <label>{this.state.errMessage}</label>
                    </div>
                    <div className="dp__add__layout__entries">
                      <div className="dp__add__layout__row">
                        <div className="dp__add__item2">
                          <label className="dp__add__label"><b>Event Title</b></label>
                          <input name="eventTitle" type="text" className="dp__add__entry--text--2" />
                        </div>
                      </div>
                      <div className="dp__add__layout__row">
                        <div className="dp__add__item">
                            <label className="dp__add__label"><b>Stay Time in hour</b></label>
                            <input name="stayTimeInHours" type="number" className="dp__add__entry--text" defaultValue="0"/>
                        </div>
                        <div className="dp__add__item">
                        <label className="dp__add__label"><b>Stay Time in mins</b></label>
                            <input name="stayTimeInMins" type="number" className="dp__add__entry--text" defaultValue="0"/>
                        </div>
                      </div>
                      <div className="dp__add__layout__row">
                        <div className="dp__add__item2">
                          <div className="route__address_title"><label className="dp__add__label"><b>Address</b></label></div>
                          <textarea name="fulladdress" className="dp__add__entry--textarea" />
                        </div>
                      </div>
                      <div className="dp__add__layout__row">
                        <div className="dp__add__item2">
                          <label className="dp__add__label"><b>Event Description</b></label>
                          <textarea name="desc" className="dp__add__entry--textarea" />
                        </div>
                      </div>
                      <div className="dp__add__layout__row2">
                          
                          <button type="submit" className="dp__add__save__btn general__button" >add</button>
                      </div>
                    </div>
                  </form>
                  
                  </div>

                </div>
                
            </div>
            <div>
              <button className="dp__add__cancel__btn" onClick={this.closeModal}>Cancel</button>
            </div>
          </div>
          </Popup>
          
          </div>
    )
  }
}
