import React, { Component } from 'react'

const ScriptList = ({ addNew, scripts, onScriptClick }) => (
  <div className='script-list list-group col-md-2'>
    <div>
      <button
        className='list-group-item list-group-item-action btn-primary'
        key='add-new'
        onClick={() => addNew()}>
        Add New
      </button>
    </div>
    <div className='scripts'>
      { scripts.map( script => (
          <button
            className={`list-group-item list-group-item-action ${ script.active ? ' active' : ''}`}
            key={script.id}
            onClick={() => onScriptClick(script.id)}
          >
            {script.name}
          </button>
      ))}
    </div>
  </div>
)

const ExpandableButtonList = ({ docs, onClick}) => (
  <div>
    { docs.map(doc => (
      <button
        key={doc.name}
        className='list-group-item list-group-item-action'
        onClick={() => onClick(doc.name)}
      >
        {doc.name}
        { doc.active &&
          <div>
            <p>{doc.desc}</p>
          </div>
        }
      </button>
    ))}
  </div>
)

class CodeEditor extends Component {
  constructor(props){
    super(props)
    console.log(props)
    this.state = {
      script: '',
      name: ''
    }
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps)
    this.setState(() => (
      {
        script: nextProps.script ? nextProps.script.script : '',
        name: nextProps.script ? nextProps.script.name : ''
      }
    ))
  }

  handleTextAreaChange = (event) => {
    let script = event.target.value
    this.setState(() => {
      return { script }
    })
  }

  handleInputChange = (event) => {
    let name = event.target.value
    this.setState(() => {
      return { name }
    })
  }

  handleSave = (event) => {
    event.preventDefault()
    let script = { ...this.props.script, script: this.state.script, name: this.state.name}
    this.props.handleSubmit(script)
  }

  render(){
    return(
      <form onSubmit={this.handleSave}>
        <div className='editor-form row'>
          <div className='name-group'>
            <div className='input-group'>
              <div className='input-group-addon'>Script Name:</div>
              <input className='form-control' type='input' value={this.state.name} onChange={this.handleInputChange}/>
            </div>
          </div>
          <div className='save-input'>
            <input className='btn btn-primary btn-save' type="submit" value="Save" />
            <input className='btn btn-danger' type="button" value="Delete" onClick={this.props.handleDelete} />
          </div>
        </div>
        <textarea className='form-group col-md-12' rows={'3'} cols={'30'} value={this.state.script} onChange={this.handleTextAreaChange} />
      </form>
    )
  }
}

export default class Scratchpad extends Component {
  render() {

    let activeScript = this.props.scripts.filter( script => (
      script.active
    ))[0]
    return (
      <div>
        <ScriptList
          addNew={this.props.onAdd}
          scripts={this.props.scripts}
          onScriptClick={this.props.onScriptClick} />
        <div className='code-editor col-md-6'>
          <CodeEditor
            script={activeScript}
            handleDelete={this.props.onDelete}
            handleSubmit={this.props.onSave}
          />
        </div>
        <div className='doc-list list-group col-md-4'>
          <ExpandableButtonList docs={this.props.docs} onClick={this.props.onDocClick}/>
        </div>
      </div>
    )
  }
}
