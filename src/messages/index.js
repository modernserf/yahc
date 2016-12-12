import React from "react"
import { connect } from "react-redux"
import { takeEvery } from "redux-saga"
import { put } from "redux-saga/effects"
import { parseMessage } from "./parser"
import { createEvalMessage } from "./eval"

export const messages = [
    { selector: "move:id to x:x y:y", action: "move" },
    { selector: "change the color of:id to:color", action: "changeColor" },
    { selector: "draw shape:shape named:id", action: "createShape" },
    { selector: "clear", action: "clear" },
    { selector: "resize:id to width:width height:height", action: "resize" },
]

const evalMessage = createEvalMessage(messages)

export const runUserMessages = takeEvery("userSentMessage", function * ({ payload: str }) {
    const parsed = parseMessage(str)
    if (parsed.status) {
        const message = evalMessage(parsed.value, str)
        yield put(message)
    } else {
        yield put({ type: "user/parseError", payload: parsed, str, error: true })
    }
})

export const reducer = () => messages

export class MessageExplorerBody extends React.Component {
    render () {
        const { messages } = this.props

        return (
            <section>
                <ul>{messages.map(({ selector }) =>
                    <li key={selector}>{selector}</li>
                )}</ul>
            </section>
        )
    }
}

export const MessageExplorer = connect(({ messages }) => ({ messages }))(MessageExplorerBody)
