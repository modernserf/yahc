import { createStore, applyMiddleware, combineReducers } from "redux"
import createSagaMiddleware, { takeEvery } from "redux-saga"
import createLogger from "redux-logger"
import { put } from "redux-saga/effects"
import { parseMessage, parseSelectorDef } from "./parser"

export const actions = {
    userSentMessage: (msg) => ({ type: "userSentMessage", payload: msg }),
}

const messages = [
    { selector: "move:id to x:x y:y", action: "move" },
    { selector: "change the color of:id to:color", action: "changeColor" },
    { selector: "draw shape:type named:id", action: "createShape" },
    { selector: "clear", action: "clear" },
    { selector: "resize:id to width:width height:height", action: "resize" },
]

const bySelector = messages.reduce((m, { selector, action }) => {
    const parsed = parseSelectorDef(selector)

    const key = parsed.map(([k]) => k).join(":")
    const argNames = parsed.map(([k, v]) => v)

    m[key] = (args, str) => {
        const payload = args.reduce((p, value, i) => {
            const name = argNames[i]
            p[name] = value
            return p
        }, {})

        return { type: `user/${action}`, payload, str }
    }

    return m
}, {})

function evalMessage ([type, body], str) {
    switch (type) {
    case "Message": {
        const selector = body.map(([k]) => k).join(":")
        const args = body.map(([k, v]) => v[1])
        if (bySelector[selector]) {
            return bySelector[selector](args, str)
        }
        return { type: "user/unknownMessage", payload: [type, body], str, error: true }
    }
    default:
        return { type: "user/tryExpression", payload: body, str }
    }
}

const parseUserMessages = takeEvery("userSentMessage", function * ({ payload: str }) {
    const parsed = parseMessage(str)
    if (parsed.status) {
        const message = evalMessage(parsed.value, str)
        yield put(message)
    } else {
        yield put({ type: "user/parseError", payload: parsed, str, error: true })
    }
})

const logReducer = (state = [], action) => {
    if (action.str) {
        return state.concat([{
            message: action.str,
            error: action.error,
        }])
    }
    return state
}

const initWorkspace = [
    {
        type: "card", id: "the card",
        width: 500, height: 500,
        color: "white",
    },
    {
        type: "circle", id: "the circle",
        x: 100, y: 100, width: 100, height: 100,
        color: "red",
    },
]

function updateList (state, id, fn) {
    return state.map((s) => {
        if (s.id !== id) { return s }
        return fn(s)
    })
}

const workspaceReducer = (state = initWorkspace, action) => {
    switch (action.type) {
    case "user/move": {
        const { id, x, y } = action.payload
        return updateList(state, id, (s) => ({ ...s, x, y }))
    }
    case "user/changeColor": {
        const { id, color } = action.payload
        return updateList(state, id, (s) => ({ ...s, color }))
    }
    case "user/resize": {
        const { id, width, height } = action.payload
        return updateList(state, id, (s) => ({ ...s, width, height }))
    }
    case "user/createShape": {
        const { type, id } = action.payload
        return state.concat({ type, id, x: 0, y: 0, width: 100, height: 100, color: "black" })
    }
    case "user/clear":
        return state.slice(0, 1)
    default:
        return state
    }
}

const rootReducer = combineReducers({
    log: logReducer,
    workspace: workspaceReducer,
})

function * rootSaga () {
    yield [
        parseUserMessages,
    ]
}

const sagaMiddleware = createSagaMiddleware()
const logger = createLogger({ collapsed: true })
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger))

export const runSaga = () => {
    sagaMiddleware.run(rootSaga)
}
