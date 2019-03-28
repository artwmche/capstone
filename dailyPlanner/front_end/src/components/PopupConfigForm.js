import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import axios from 'axios';


export default class PopupConfigForm extends Component {

    constructor(props){
        super(props);
        //this._isMounted = false;
        this.state={
            open : false,
            errMessage : []
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
      }


    openModal=()=>{
      this.setState({open:true,errMessage:[]});
    }  
    closeModal=()=>{
      this.setState({open:false});
    }

    addEditItem=(event)=>{
        event.preventDefault();
        //console.log("add Item stock status:" + this.state.checked);
        /*let errTxt=[];
        if(event.target.api_key.value.trim().length === 0){
          errTxt.push(<div>Google api key is required.</div>);
        }
        if(event.target.m_interval.value.trim().length === 0){
          errTxt.push(<div>Marquee data retrieval time is required.</div>);
        }
        if(event.target.sms_phone.value.trim().length === 0){
          errTxt.push(<div>SMS phone is required.</div>);
        }
        if(event.target.twilio.value.trim().length === 0){
          errTxt.push(<div>Twilio is required.</div>);
        }
        if(errTxt.length != 0){
          this.setState({
            errMessage: errTxt
          });
        }
        else{*/
          let body = {
              api_key : event.target.api_key.value,
              m_interval : event.target.m_interval.value,
              sms_phone : event.target.sms_phone.value,
              twilio : event.target.twilio.value
          };
          //console.log(body);
          axios({
              method: 'post',
              url: 'http://localhost:8080/dailyPlanner/updateConfig',
              data: body,
              config: { headers:{'Content-Type':'application/json'}}
          })
          .then(result=>{
            console.log(result);
            this.setState({open:false});
              
          })
          .catch(err=>{
              console.log(err);
          });
        //}

         
    }
    
   
  render() {
    return (
      <>
      <button onClick={this.openModal}  className="general__button">Config</button>
        <Popup 
        modal
        open = {this.state.open}
        defaultOpen={false}
        contentStyle={{width:'auto'}}
        onClose={this.closeModal}

        >
          <div className="add__form__layout">
            <form onSubmit={this.addEditItem}>
            <div className="dp__add__header"><h1>Config</h1></div>
            <div className="dp__add__errMessage">
              <label>{this.state.errMessage}</label>
            </div>
            <div className="dp__add__layout__entries">
              <div className="dp__add__layout__row">
                <div className="dp__add__item">
                    <label className="dp__add__label">Google API KEY</label>
                    <input name="api_key" type="text" className="dp__add__entry--text" />
                </div>
                <div className="dp__add__item">
                    <label className="dp__add__label">Marquee Data retriveful interval (in mins)</label>
                    <input name="m_interval" type="text"   className="dp__add__entry--text"/>
                </div>
              </div>
              <div className="dp__add__layout__row">
                <div className="dp__add__item">
                  <label className="dp__add__label">SMS phone number</label>
                  <input name="sms_phone" type="text" className="dp__add__entry--text" />
                </div>
                <div className="dp__add__item">
                  <label className="dp__add__label">Twilio phone number</label>
                  <input name="twilio" type="text" className="dp__add__entry--text" />
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
