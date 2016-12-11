import React from "react"
import styled from "styled-components"
import Console from "./Console"

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
    flex-grow: 1;
    flex-shrink: 0;
    background-color: #ccc;`

const ConsoleWrap = styled.div`
    flex-shrink: 0;
    flex-basis: 50%;
    display: flex;`

export default class App extends React.Component {
    render () {
        return (
            <Container>
                <Workspace/>
                <Tools>
                    <Explorer>
                        explorer goes here
                    </Explorer>
                    <ConsoleWrap>
                        <Console/>
                    </ConsoleWrap>
                </Tools>
            </Container>
        )
    }
}
