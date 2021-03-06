import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import './index.less'
import { RootState, Dispatch } from'../../common/rematch'
import Panel, { ItemList, SortResult } from './Panel'
import { connect } from 'react-redux'

const bruh = [
  {
    key: "channel/uuid1",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid2",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid3",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid4",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid5",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid6",
    name: "华北浪革",
    color: "#888"
  },
  {
    key: "channel/uuid7",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid8",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid9",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid10",
    name: "捕蛇者说",
    image: "https://i.typlog.com/pythonhunter/8444690454_041962.png?x-oss-process=style/ss"
  },
  {
    key: "channel/uuid11",
    name: "内核恐慌",
    image: "https://pan.icu/assets/icon@2x.png"
  }
]

const routes = [
  {
    key: "home",
    name: "首页",
    link: "/"
  },
  {
    key: "extensions",
    name: "扩展程序",
    link: "/extensions"
  }
]

class Navi extends Component<StateProps & DispatchProps & RouteComponentProps> {
  state = {
    borderless: false,
    itemList: bruh
  }
  nextList: Array<ItemList> | null = null

  handlePanelSort = (newList: Array<ItemList>) => {
    this.nextList = newList
  }

  handleSortDone = (result: SortResult) => {
    if(this.nextList !== null) {
      this.setState({
        itemList: this.nextList
      })
    }
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, key: string) => {
    // console.log('clicked ' + key, e)
    routes.forEach(val => {
      if(val.key === key) {
        this.props.history.push(val.link)
      }
    })
  }

  renderControl = () => {
    if(this.props.contentPlaying.ready) {
      return (
        <div className="control-navi-container">
          <div className="control-gradient"></div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    let currentItemKey = 'home'
    routes.forEach(val => {
      if(val.link === this.props.location.pathname) {
        currentItemKey = val.key
      }
    })
    return (
      <div className={this.props.contentPlaying.ready ? "navi play" : "navi"}>
        <Panel
          items={routes}
          current={currentItemKey}
          onClick={this.handleClick}
        />
        <Panel
          items={this.state.itemList}
          current={currentItemKey}
          onSort={this.handlePanelSort}
          onSortDone={this.handleSortDone}
          onClick={this.handleClick}
          withDivider={this.props.contentPlaying.ready}
        />
        {this.renderControl()}
      </div>
    )
  }
}

const mapState = (state: RootState) => ({
  contentPlaying: state.player.playing
})

const mapDispatch = (dispatch: Dispatch) => ({

})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

export default connect(mapState, mapDispatch)(withRouter(Navi))