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
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: ${({ color }) => color};
    box-shadow: 0 0 8px 4px rgba(0,0,0,0.1);`

const Rectangle = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: ${({ color }) => color};
    transform: ${({ x = 0, y = 0 }) => `translate(${x}px,${y}px)`};`

const Circle = styled(({ className, ...props }) => <Rectangle className={className} {...props} />)`
    border-radius: 50%;`

const components = {
    card: Card,
    circle: Circle,
    rectangle: Rectangle,
}

class Workspace extends React.Component {
    render () {
        const { workspace } = this.props

        return (
            <CardWrap>
                {workspace.map(({ type, id, ...props }) => {
                    const Component = components[type]
                    return <Component key={id} {...props}/>
                })}
            </CardWrap>
        )
    }
}

export default connect(
    ({ workspace }) => ({ workspace }),
)(Workspace)
