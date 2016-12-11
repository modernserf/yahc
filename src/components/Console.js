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

const ConsoleInput = styled.textarea`
    flex-shrink: 0;
    display: block;
    width: 100%;
    padding: 1em
    font-family: inherit;`

class Console extends React.Component {
    state = {
        message: "",
    }
    onChange = (e) => {
        this.setState({ message: e.target.value })
    }
    onSubmit = () => {
        this.props.userSentMessage(this.state.message)
        this.setState({ message: "" })
    }
    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            this.onSubmit()
        }
    }
    render () {
        const { log } = this.props
        const { message } = this.state

        return (
            <Container>
                <LogWrap>
                    <Log>
                        {log.map((msg, i) => <li key={i}>{msg}</li>)}
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
