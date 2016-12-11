import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { actions } from "../data"

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;`

const LogWrap = styled.div`
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;`

const Log = styled.ul`
    overflow: scroll;`

const LogItem = styled.li`
    margin: 0.5em 1em;
    list-style-type: none;`

const ConsoleInput = styled.textarea`
    flex-shrink: 0;
    display: block;
    width: 100%;
    padding: 1em
    font-family: inherit;
    font-size: inherit;`

class Console extends React.Component {
    state = {
        message: "",
        logCursor: 0,
    }
    onChange = (e) => {
        this.setState({ message: e.target.value })
    }
    onSubmit = () => {
        this.props.userSentMessage(this.state.message)
        this.setState({ message: "", logCursor: 0 })
    }
    onKeyDown = (e) => {
        switch (e.keyCode) {
        case 13: // return
            e.preventDefault()
            this.onSubmit()
            return
        case 38: { // up
            e.preventDefault()
            const { log } = this.props
            const nextCursor = (log.length + (this.state.logCursor - 1)) % log.length
            this.setState({
                logCursor: nextCursor,
                message: log[nextCursor],
            })
            return
        }
        case 40: { // down
            e.preventDefault()
            const { log } = this.props
            const nextCursor = (log.length + (this.state.logCursor + 1)) % log.length
            this.setState({
                logCursor: nextCursor,
                message: log[nextCursor],
            })
            return
        }
        default:
            return
        }
    }
    render () {
        const { log } = this.props
        const { message } = this.state

        return (
            <Container>
                <LogWrap>
                    <Log>
                        {log.map((msg, i) => <LogItem key={i}>{msg}</LogItem>)}
                    </Log>
                </LogWrap>
                <ConsoleInput value={message}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown} />
            </Container>
        )
    }
}

export default connect(
    ({ log }) => ({ log }),
    { userSentMessage: actions.userSentMessage },
)(Console)
