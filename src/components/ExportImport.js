import React, { Component } from 'react'

export const ExportImport = ({ handleExport, handleImport }) => (
  <div className='navbar-right'>
    <form className='export-import' method="get" action="file.doc">
       <button className='btn btn-primary export-import' type="submit">Export State</button>
    </form>
    <form className='export-import' method="get" action="file.doc">
       <button className='btn btn-info export-import' type="submit">Import State</button>
    </form>
  </div>
)
