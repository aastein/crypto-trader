import React, { Component } from 'react'


const CodeEditor = ({ activeScript, handleTextAreaChange, handleInputChange, handleSubmit, handleDelete }) => (
  <form onSubmit={handleSubmit}>
    <div className='editor-form row'>
      <div className='name-group'>
        <div className='input-group'>
          <div className='input-group-addon'>Script Name:</div>
          <input className='form-control' type='input' value={activeScript.name} onChange={handleInputChange}/>
        </div>
      </div>
      <div className='save-input'>
        <input
          className='btn btn-primary btn-save'
          type="submit"
          value="Save"
        />
        <input
          className='btn btn-danger'
          type="button"
          value="Delete"
          onClick={() => handleDelete(activeScript.id)}
        />
      </div>
    </div>
    <textarea className='form-group col-md-12' rows={'3'} cols={'30'} value={activeScript.script} onChange={handleTextAreaChange} />
  </form>
)

const ExpandableButtonList = ( { docs, onClick} ) => (
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

const ScriptList = ({ activeId, addNew, scripts, onClick }) => (
  <div>
    <button
      className='list-group-item list-group-item-action btn-success'
      key='add-new'
      onClick={() => addNew()}>
      Add New
    </button>
    { scripts.map( script => (
        <button
          className={`list-group-item list-group-item-action ${ activeId === script.id ? ' active' : ''}`}
          key={script.id}
          onClick={() => onClick(script.id)}
        >
          {script.name}
        </button>
    ))}
  </div>
)

export default class Scratchpad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeScript: {
        script: '',
        name: '',
        id: 0
      },
      docs: [
        {
          name: 'btc',
          desc: 'Bitcoin price.\nparams: date: Date string in ISO_8601 format\nVale: Open, High, Low, Close',
          active: false
        }
      ],
      scripts: [
        {
          id: 1,
          name: 'Crossover-1',
          script: 'function crossover(){ return true; } crossover()'
        }
      ]
    }
    this.handleChange = this.handleInputChange.bind(this)
    this.handleChange = this.handleTextAreaChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleDocClick = this.handleDocClick.bind(this)
    this.handleScriptClick = this.handleScriptClick.bind(this)
    this.handleAddNewScript = this.handleAddNewScript.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleTextAreaChange = (event) => {
    event.preventDefault()
    const script = event.target.value
    this.setState((prevState, event) => {
      let newActiveScript = { ...prevState.activeScript, script }
      return { activeScript: newActiveScript };
    })
  }

  handleInputChange = (event) => {
    event.preventDefault()
    const name = event.target.value
    this.setState((prevState) => {
      let newActiveScript = { ...prevState.activeScript, name }
      return { activeScript: newActiveScript };
    })
  }

  handleAddNewScript = (event) => {
    let newScript = {}
    this.setState((prevState) => {
      if(!prevState.scripts.filter( s => (s.name === 'New Script'))[0]){
        newScript.id = 1 + prevState.scripts.reduce((max, script) => (
          Math.max(max, script.id)
        ), 0);
        newScript.script=''
        newScript.name='New Script'
        return { scripts: [ ...prevState.scripts, newScript ] }
      }
      alert('Script already exists with name "New Script"')
      return prevState
    })
  }

  handleSave = (event) => {
    if(event) event.preventDefault()
    let activeScript = this.state.activeScript
    if(activeScript.name.trim().length > 0){
      try {
        eval(activeScript.script)
        this.setState((prevState) => {
          if(!prevState.scripts.filter( s => (s.name === activeScript.name && s.id !== activeScript.id))[0]){
            let newScripts
            if (activeScript.id) {
              newScripts = prevState.scripts.map( script => {
                if(script.id === activeScript.id ) {
                  script = activeScript
                }
                return script
              })
            } else {
              activeScript.id = 1 + prevState.scripts.reduce((max, script) => (
                Math.max(max, script.id)
              ), 0);
              newScripts = [ ...prevState.scripts, activeScript ]
            }
            return { scripts: newScripts }
          }
          alert('Script already exists with name ' + activeScript.name)
          return prevState
        })
      }
      catch(err) {
        alert('Script is invalid. Must evaluate to true or false.\n\nMessage:\n\n' + err.message)
      }
    }
  }

  handleDelete = (id) => {
    console.log('deleting' + id)
    this.setState((prevState) => (
        { scripts: prevState.scripts.filter((s) => (
          s.id !== id
        )),
        activeScript: { ...prevState.activeScript, name : '', script: '', id: '' }
      }
    ))
  }

  handleDocClick = (name) => {
    this.setState((prevState) => {
      let newDocs = prevState.docs.map( doc => {
        if(doc.name === name) {
          doc.active = !doc.active
        }
        return doc
      })
      return { docs: newDocs}
    })
  }

  handleScriptClick = (id) => {
    this.setState((prevState) => {
      let newActiveScript = prevState.scripts.filter( version => (
        version.id === id
      ))[0]
      return { activeScript: newActiveScript }
    })
  }

  render() {
    return (
      <div>
        <div className='script-list list-group col-md-2'>
          <ScriptList
            activeId={this.state.activeScript.id}
            addNew={this.handleAddNewScript}
            scripts={this.state.scripts}
            onClick={this.handleScriptClick} />
        </div>
        <div className='code-editor col-md-6'>
          <CodeEditor
            activeScript={this.state.activeScript}
            handleDelete={this.handleDelete}
            handleInputChange={this.handleInputChange}
            handleTextAreaChange={this.handleTextAreaChange}
            handleSubmit={this.handleSave}
          />
        </div>
        <div className='doc-list list-group col-md-3'>
          <ExpandableButtonList docs={this.state.docs} onClick={this.handleDocClick}/>
        </div>
      </div>
    )
  }
}
