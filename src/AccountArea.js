import React from 'react'
import AccountItem from './AccountItem'
import AccountRoot from './AccountRoot'
import AccountForm from './AccountForm'
import Tooltip from '@material-ui/core/Tooltip'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import IconButton from '@material-ui/core/IconButton'

export default class AccountArea extends React.Component {
  isMacOs = window.utools.isMacOs()

  state = {
    selectedIndex: 0
  }

  keydownAction = (e) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      if (!this.props.data || this.props.data.length < 2) return
      e.preventDefault()
      if (e.code === 'ArrowUp') {
        if (this.state.selectedIndex === 0) {
          this.setState({ selectedIndex: this.props.data.length - 1 })
        } else {
          this.setState({ selectedIndex: this.state.selectedIndex - 1 })
        }
      } else {
        if (this.state.selectedIndex === this.props.data.length - 1) {
          this.setState({ selectedIndex: 0 })
        } else {
          this.setState({ selectedIndex: this.state.selectedIndex + 1 })
        }
      }
      return
    }
    if (e.code === 'KeyN' && (this.isMacOs ? e.metaKey : e.ctrlKey)) {
      e.preventDefault()
      e.stopPropagation()
      window.utools.subInputBlur()
      this.handleCreate()
    }
  }

  componentDidMount () {
    let selectedIndex = window.localStorage.getItem('accountContent.selectedIndex')
    if (selectedIndex) {
      selectedIndex = parseInt(selectedIndex, 10)
      setTimeout(() => {
        if (this.props.data && selectedIndex < this.props.data.length) {
          this.setState({ selectedIndex })
        }
      }, 10)
    }
    window.addEventListener('keydown', this.keydownAction)
  }

  componentWillUnmount () {
    window.localStorage.setItem('accountContent.selectedIndex', this.state.selectedIndex)
    window.removeEventListener('keydown', this.keydownAction)
  }

  UNSAFE_componentWillReceiveProps (nextProps) { // eslint-disable-line
    if (nextProps.data) {
      if (this.props.data === nextProps.data && (Date.now() - nextProps.data[nextProps.data.length - 1].createAt < 100)) {
        this.setState({ selectedIndex: nextProps.data.length - 1 })
        return
      }
      this.setState({ selectedIndex: 0 })
    }
  }

  handleSelect = (index) => {
    if (index === this.state.selectedIndex) return
    this.setState({ selectedIndex: index })
  }

  handleCreate = () => {
    this.props.onCreate()
    setTimeout(() => {
      const titleInput = document.querySelector('#accountFormTitle')
      if (titleInput) titleInput.focus()
    }, 50)
  }

  handleDelete = () => {
    if (!this.props.data) return
    this.props.onDelete(this.props.data[this.state.selectedIndex])
  }

  handleMoveSort = (fromIndex, toIndex) => {
    const { data, sortedGroup } = this.props
    const selectedNode = data[this.state.selectedIndex]
    const fromAccount = data[fromIndex]

    data.splice(fromIndex, 1)
    data.splice(toIndex, 0, fromAccount)

    if (!sortedGroup.includes(fromAccount.groupId)) {
      sortedGroup.push(fromAccount.groupId)
    }
    this.setState({ selectedIndex: data.indexOf(selectedNode) })
  }

  render () {
    const { keyIV, data, onUpdate, decryptAccountDic } = this.props
    const { selectedIndex } = this.state
    if (data === null) return false
    return (
      <div className='account-area'>
        <div className='account-list'>
          <div className='account-list-body'>
            {
              data && (
                <AccountRoot move={this.handleMoveSort} index={data.length}>
                  {
                    data.map((a, i) => (
                      <div key={i} onClick={() => this.handleSelect(i)}>
                        <AccountItem move={this.handleMoveSort} index={i} isSelected={i === selectedIndex} key={a._id} data={decryptAccountDic[a._id]} />
                      </div>))
                  }
                </AccountRoot>)
            }
          </div>
          <div className='account-list-footer'>
            <Tooltip title={'新增条目 ' + (this.isMacOs ? '⌘' : 'Ctrl') + '+N'} placement='top'>
              <div>
                <IconButton tabIndex='-1' onClick={this.handleCreate} size='small'>
                  <AddIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title='删除条目' placement='top'>
              <div>
                <IconButton tabIndex='-1' disabled={!data} onClick={this.handleDelete} size='small'>
                  <RemoveIcon />
                </IconButton>
              </div>
            </Tooltip>
          </div>
        </div>
        <div className='account-area-right'>
          {data && <AccountForm keyIV={keyIV} decryptAccountDic={decryptAccountDic} onUpdate={onUpdate} data={data[selectedIndex]} /> }
        </div>
      </div>)
  }
}
