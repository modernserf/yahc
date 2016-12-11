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

const Card = styled.div`
    position: absolute;
    width: 500px;
    height: 500px;
    background-color: white;
    box-shadow: 0 0 4px 4px rgba(0,0,0,0.1);`

const Circle = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background-color: ${({ color }) => color};
    border-radius: 50%;
    transform: ${({x = 0, y = 0}) => `translate(${x}px,${y}px)`};`

const components = {
    card: Card,
    circle: Circle,
}

class Workspace extends React.Component {
    render () {
        const { workspace } = this.props

        return (
            <CardWrap>
                {workspace.map(({ type, id, x, y, color }) => {
                    const Component = components[type]
                    return <Component key={id} x={x} y={y} color={color}/>
                })}
            </CardWrap>
        )
    }
}

export default connect(
    ({ workspace }) => ({ workspace }),
)(Workspace)
