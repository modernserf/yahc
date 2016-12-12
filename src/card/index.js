import styled from "styled-components"

const Card = styled.div`
    position: absolute;
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: ${({ fill }) => fill};
    box-shadow: 0 0 8px 4px rgba(0,0,0,0.1);`

export function createCard ({
    id,
    width = 500, height = 500, fill = "white",
}) {
    const props = { width, height, fill }
    return { id, props, Component: Card }
}
