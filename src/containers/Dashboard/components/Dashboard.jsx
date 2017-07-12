import React from 'react';
import moment from 'moment';

import ChartHeader from './ChartHeader';
import Chart from './Chart';
import Scratchpad from './Scratchpad';

const Dashboard = props => (
  (
    <div className="dashboard">
      <div className="dashboard">
        <div className="col-md-9">
          <ChartHeader
            chart={props.chart}
            selectedProductIds={props.profile.selectedProducts.map(p => (p.value))}

            selectProduct={props.selectProduct}
            setGanularity={props.setGranularity}
            setProductData={props.setProductData}
            selectIndicator={props.selectIndicator}
            editIndicator={props.editIndicator}
            selectDateRange={props.selectDateRange}
            setProducts={props.setProducts}
            setProductWSData={props.setProductWSData}
          />
          <Chart
            chart={props.chart}
            scripts={props.scripts}
            profile={props.profile}
            appendLog={props.appendLog}
            updateAccounts={props.updateAccounts}
          />
        </div>
        <div className="log col-md-3">
          <h2>
            History
          </h2>
          <div className="log-messages">
            { props.log.map((l, i) => (
              (
                <p className="" key={l.time + i}>{`${moment(l.time).format('h:mm:ss a')}: ${l.message}`}</p>
              )
            ))}
          </div>
        </div>
      </div>
      <div className="container dashboard-bottom">
        <div className="col-md-12">
          <Scratchpad
            scripts={props.scripts}
            products={props.chart.products}
            profile={props.profile}

            addScript={props.addScript}
            appendLog={props.appendLog}
            saveScript={props.saveScript}
            deleteScript={props.deleteScript}
            saveTestResult={props.saveTestResult}
            selectScript={props.selectScript}
            selectProductDoc={props.selectProductDoc}
            toggleScriptLive={props.toggleScriptLive}
            updateAccounts={props.updateAccounts}
          />
        </div>
      </div>
    </div>
  )
);

export default Dashboard;
