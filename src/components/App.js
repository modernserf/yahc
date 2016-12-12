import React from "react"
import styled from "styled-components"
import Console from "./Console"
import Workspace from "./Workspace"
import { MessageExplorer } from "../messages"

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;`

const WorkspaceWrap = styled.div`
    flex-basis: 66%;
    background-color: #ccc;`

const Tools = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;`

const ExplorerWrap = styled.div`
    flex-grow: 1;
    flex-shrink: 0;`

const ConsoleWrap = styled.div`
    flex-basis: 33%;
    display: flex;`

export default class App extends React.Component {
    render () {
        return (
            <Container>
                <WorkspaceWrap>
                    <Workspace/>
                </WorkspaceWrap>
                <Tools>
                    <ExplorerWrap>
                        <details>
                            <summary>Messages</summary>
                            <MessageExplorer/>
                        </details>
                    </ExplorerWrap>
                    <ConsoleWrap>
                        <Console/>
                    </ConsoleWrap>
                </Tools>
            </Container>
        )
    }
}
