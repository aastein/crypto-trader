import React, { Component } from 'react'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import 'react-dates/lib/css/_datepicker.css'

export default class Datepicker extends Component {
  constructor(props){
    super(props)
    this.state = {
      focusedInput: null,
      startDate: this.props.startDate,
      endDate: this.props.endDate
    }
  }

  // ({startDate, endDate, focusedInput, onFocusChange, onDatesChange, onApply, isFetching }) => {

  onFocusChange = (focusedInput) => {
    focusedInput = focusedInput.focusedInput
    this.setState((prevState) => {
      return { ...prevState, focusedInput }
    })
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.setState((prevState) => {
      startDate = startDate ? startDate.toISOString() : null
      endDate = endDate ? endDate.toISOString() : startDate
      return { ...prevState, startDate, endDate }
    })
  }

  onApply = (event) => {
    event.preventDefault()

    /*
      set is fetching to true in the cart state
      call a function to get new data for the selected date range
      set the date range in the chart state
    */

    this.props.onApply(this.state.startDate, this.state.endDate)
  }

  render() {
    return (
      <div>
        <DateRangePicker
          startDate={moment(this.state.startDate)} // momentPropTypes.momentObj or null,
          endDate={moment(this.state.endDate)} // momentPropTypes.momentObj or null,
          onDatesChange={({startDate, endDate}) => this.onDatesChange({ startDate, endDate })} // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={(focusedInput) => this.onFocusChange({ focusedInput })} // PropTypes.func.isRequired,
          isOutsideRange={() => false}
        />
      </div>
    )
  }
}
