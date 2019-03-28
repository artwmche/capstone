import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios';

export default class PopupAddEventForm extends Component {

    constructor(props){
        super(props);
        //this._isMounted = false;
        this.state={
            //keepOpen : false,
            //inventorylist : [],
            open : false,
            //checked : true,
            //stock_status: "In Stock",
            //refreshList : this.props.refreshList,
            errMessage : [],
            parentPage : props.parent
        };
        //this.handleChange = this.handleChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
      }

    openModal=()=>{
      this.setState({open:true,errMessage:[]});
    }  
    closeModal=()=>{
      this.setState({open:false});
    }

    addEvent=(event)=>{
        event.preventDefault();
        //console.log("add Item stock status:" + this.state.checked);
        let errTxt=[];
        if(event.target.eventTitle.value.trim().length === 0){
          errTxt.push(<div>Event Title is required.</div>);
        }
        if(event.target.startTime.value.trim().length === 0){
          errTxt.push(<div>Start Time is required.</div>);
        }
        if(event.target.endTime.value.trim().length === 0){
          errTxt.push(<div>End Time is required.</div>);
        }
        if(event.target.fulladdress.value.trim().length === 0){
          errTxt.push(<div>Address is required.</div>);
        }
        if(event.target.desc.value.trim().length === 0){
          errTxt.push(<div>Description is required.</div>);
        }

        if(errTxt.length != 0){
          this.setState({
            errMessage: errTxt
          });
        }
        else{
          let body = {
              eventTitle : event.target.eventTitle.value,
              startTime : new Date(event.target.startTime.value),
              endTime : new Date(event.target.endTime.value),
              fulladdress : event.target.fulladdress.value,
              desc : event.target.desc.value
          };
          //console.log(body);
          axios({
              method: 'post',
              url: 'http://localhost:8080/dailyPlanner/addEvent',
              data: body,
              config: { headers:{'Content-Type':'application/json'}}
          })
          .then(result=>{
            this.setState({open:false});
            //this.state.refreshList();
            this.state.parentPage.allTask();
            
          })
          .catch(err=>{
              console.log(err);
          });
        }

         
    }
    
   
  render() {
    return (
      <>
      <button onClick={this.openModal} className="general__button">Add Event</button>
        <Popup 
        modal
        open = {this.state.open}
        defaultOpen={false}
        contentStyle={{width:'auto'}}
        onClose={this.closeModal}

        >
          <div className="add__form__layout">
            <form onSubmit={this.addEvent}>
            <div className="dp__add__header"><h1>New Events</h1></div>
            <div className="dp__add__errMessage">
              <label>{this.state.errMessage}</label>
            </div>
            <div className="dp__add__layout__entries">
              <div className="dp__add__layout__row">
                <div className="dp__add__item2">
                  <label className="dp__add__label">Event Title</label>
                  <input name="eventTitle" type="text" className="dp__add__entry--text--2" />
                </div>
              </div>
              <div className="dp__add__layout__row">
                <div className="dp__add__item">
                    <label className="dp__add__label">Start Time</label>
                    <input name="startTime" type="datetime-local" className="dp__add__entry--text" />
                </div>
                <div className="dp__add__item">
                    <label className="dp__add__label">End Time</label>
                    <input name="endTime" type="datetime-local"   className="dp__add__entry--text"/>
                </div>
              </div>
              <div className="dp__add__layout__row">
                <div className="dp__add__item2">
                  <label className="dp__add__label">Address</label>
                  <textarea name="fulladdress" className="dp__add__entry--textarea" />
                </div>
              </div>
              <div className="dp__add__layout__row">
                <div className="dp__add__item2">
                  <label className="dp__add__label">Event Description</label>
                  <textarea name="desc" className="dp__add__entry--textarea" />
                </div>
              </div>
              <div className="dp__add__layout__row2">
                  <button className="dp__add__cancel__btn general__button" onClick={this.closeModal}>Cancel</button>
                  <button type="submit" className="dp__add__save__btn general__button" >Save</button>
              </div>
            </div>
            </form>
          </div>
          </Popup>
          </>
    )
  }
}
