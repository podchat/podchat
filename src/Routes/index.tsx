import React from 'react'
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Platforms } from '../common/constants/os'
import { RootState } from'../common/rematch'

import Navi from '../Components/Navi'
import WindowControls from '../Components/WindowControls'

import Home from '../Pages/Home'
import Extensions from '../Pages/Extensions'

function Routes(props: StateProps) {
  return (
    <Router>
      <Navi />
      <div className="container">
        { props.platform === Platforms.WINDOWS && <WindowControls /> }
        <Switch>
          <Route path="/extensions">
            <Extensions />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
const mapState = (state: RootState) => ({
  platform: state.appWindow.platform
})
type StateProps = ReturnType<typeof mapState>

export default connect(mapState)(Routes)