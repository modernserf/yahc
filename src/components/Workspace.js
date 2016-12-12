import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"

const CardWrap = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-250px, -250px);
    width: 500px;
    height: 500px;`

class Workspace extends React.Component {
    render () {
        const { workspace } = this.props

        return (
            <CardWrap>
                {workspace.map(({ id, Component, props }) => {
                    return <Component key={id} {...props}/>
                })}
            </CardWrap>
        )
    }
}

export default connect(
    ({ workspace }) => ({ workspace }),
)(Workspace)
