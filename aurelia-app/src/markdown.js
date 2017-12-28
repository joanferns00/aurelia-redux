import marked from 'marked';
import {bindable} from 'aurelia-framework';
import {createStore} from 'redux';
import undoable from 'redux-undo';
import {ActionCreators} from 'redux-undo';

export class Markdown{
  @bindable raw;
  html = '';
  store=createStore(undoable(textUpdater));
  pastCount = 0;
  futureCount = 0;

  constructor(){
     this.store.subscribe(this.update.bind(this));
  }

  update(){
    const state = this.store.getState().present;
    this.html = state.html;
    this.raw = state.raw;
    this.pastCount = this.store.getState().past.length;
    this.futureCount = this.store.getState().future.length;
  }

  keyupHandler(newValue){
     this.store.dispatch(updateText(newValue));
  }

  undo(){
    this.store.dispatch(ActionCreators.undo());
  }

  redo(){
    this.store.dispatch(ActionCreators.redo());
  }

  attached(){
    this.keyupHandler(this.raw);
  }

}

//For simplicitys sake, we are placing the action creator and the reducer in this file.
const TEXT_UPDATE = 'UPDATE';

//action creator
const updateText = (text)=>{
  return{
    type: TEXT_UPDATE,
    text
  };
};

//reducer
function textUpdater(state={raw:'', html:''}, action){
  switch(action.type){
    case TEXT_UPDATE:
      return {
        raw: action.text,
        html: marked(action.text)
      };
    default:
    return state;
  }
}

