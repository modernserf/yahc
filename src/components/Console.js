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
    display: flex;`

const LogText = styled.div`
    padding: 0.5em 0.5em 0;`

const StatusBlock = styled.div`
    padding: 0.5em 0.5em 0;
    width: 1.5em;`

const InputWrap = styled.div`
    border-top: 1px solid #ccc;
    flex-shrink: 0;
    display: flex;`

const ConsoleInput = styled.textarea`
    border: none;
    display: block;
    width: 100%;
    padding: 0.5em;
    font-family: inherit;
    font-size: inherit;
    &:focus {
        outline: none;
    }`

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
        case 38: // up
            e.preventDefault()
            this.moveCursor(-1)
            return
        case 40:  // down
            e.preventDefault()
            this.moveCursor(1)
            return
        default:
            return
        }
    }
    moveCursor = (offset) => {
        const { log } = this.props
        if (!log.length) { return }
        const nextCursor = (log.length + (this.state.logCursor + offset)) % log.length
        this.setState({
            logCursor: nextCursor,
            message: log[nextCursor].message,
        })
    }
    render () {
        const { log } = this.props
        const { message } = this.state

        return (
            <Container>
                <LogWrap>
                    <Log>{log.map(({ message, error }, i) =>
                        <LogItem key={i}>
                            <StatusBlock>{error ? "❌" : "✅"}</StatusBlock>
                            <LogText>{message}</LogText>
                        </LogItem>
                    )}</Log>
                </LogWrap>
                <InputWrap>
                    <StatusBlock>{">"}</StatusBlock>
                    <ConsoleInput value={message}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown} />
                </InputWrap>
            </Container>
        )
    }
}

export default connect(
    ({ log }) => ({ log }),
    { userSentMessage: actions.userSentMessage },
)(Console)
