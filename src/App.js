import React from "react"
import styled from "styled-components"

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;`

const Workspace = styled.div`
    flex-grow: 1;
    background-color: #ccc;`

const Tools = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;`

const Explorer = styled.div`
    flex-grow: 1;`

const Log = styled.div`
    flex-grow: 2;`

const Console = styled.textarea`
    display: block;
    width: 100%;
    padding: 1em
    font-family: inherit;`

export default class App extends React.Component {
    state = {
        log: [],
        currentCommand: "",
    }
    onChange = (e) => {
        this.setState({ currentCommand: e.target.value })
    }
    onSubmit = () => {
        const { log, currentCommand } = this.state
        this.setState({
            log: log.concat([currentCommand]),
            currentCommand: "",
        })
    }
    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            this.onSubmit()
        }
    }
    render () {
        const { log, currentCommand } = this.state
        return (
            <Container>
                <Workspace/>
                <Tools>
                    <Explorer>
                        explorer goes here
                    </Explorer>
                    <Log>
                        {log.map((msg, i) => <div key={i}>{msg}</div>)}
                    </Log>
                    <Console value={currentCommand}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown} />
                </Tools>
            </Container>
        )
    }
}
