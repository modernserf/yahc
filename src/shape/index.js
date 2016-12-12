import React from "react"
import styled from "styled-components"

const Rectangle = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    z-index: ${({ z = 0 }) => z};
    background-color: ${({ fill }) => fill};
    transform: ${({ x = 0, y = 0 }) => `translate(${x}px,${y}px)`};`

const Circle = styled(({ className, ...props }) => <Rectangle className={className} {...props} />)`
    border-radius: 50%;`

export const shapes = [
    { id: "circle", component: Circle },
    { id: "rectangle", component: Rectangle },
]

const shapeMap = shapes.reduce((m, s) => { m[s.id] = s; return m }, {})

export function createShape ({
    id, shape,
    x = 0, y = 0, z = 0, width = 100, height = 100,
    stroke = "none", fill = "black",
}) {
    if (shapeMap[shape]) {
        const props = { x, y, z, width, height, stroke, fill }
        return { id, shape, props, Component: shapeMap[shape].component }
    }
}
