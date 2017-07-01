import React from 'react'
import { DateRangePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

export let Datepicker = ({startDate, endDate, focusedInput, onFocusChange, onDatesChange, onApply, isFetching }) => {
  return (
    <div>
      <DateRangePicker
        startDate={startDate} // momentPropTypes.momentObj or null,
        endDate={endDate} // momentPropTypes.momentObj or null,
        onDatesChange={({startDate, endDate}) => onDatesChange({ startDate, endDate })} // PropTypes.func.isRequired,
        focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={(focusedInput) => onFocusChange({ focusedInput })} // PropTypes.func.isRequired,
        isOutsideRange={() => false}
      />
      <button className="date-range-button btn btn-primary" onClick={onApply} disabled={isFetching}>Apply</button>
    </div>
  )
}
