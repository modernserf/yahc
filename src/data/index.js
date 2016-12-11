import { createStore, applyMiddleware, combineReducers } from "redux"
import createSagaMiddleware, { takeEvery } from "redux-saga"
import createLogger from "redux-logger"
import { put } from "redux-saga/effects"
import { parseMessage } from "./parser"

export const actions = {
    userSentMessage: (msg) => ({ type: "userSentMessage", payload: msg }),
}

export const userMessages = {
    "move:to x:y:": ([id, x, y]) => ({ type: "user/move", payload: { id, x, y } }),
    "change the color of:to:": ([id, color]) =>
        ({ type: "user/changeColor", payload: { id, color } }),
    "draw shape:named:at x:y:": ([type, id, x, y]) =>
        ({ type: "user/createShape", payload: { type, id, x, y } }),
}

function evalMessage ([type, body], str) {
    switch (type) {
    case "Message": {
        const selector = body.map(([k]) => k + ":").join("")
        const args = body.map(([k, v]) => v[1])
        if (userMessages[selector]) {
            return userMessages[selector](args)
        }
        return { type: "user/unknownMessage", payload: str }
    }
    default:
        return { type: "user/tryExpression", payload: body }
    }
}

const parseUserMessages = takeEvery("userSentMessage", function * ({ payload: str }) {
    const { status, value } = parseMessage(str)
    if (status) {
        const message = evalMessage(value, str)
        yield put(message)
    } else {
        yield put({ type: "user/parseError", payload: str })
    }
})

const logReducer = (state = [], action) => {
    if (action.type === "userSentMessage") {
        return state.concat(action.payload)
    }
    return state
}

const initWorkspace = [
    { type: "card", id: "the card", x: 0, y: 0, color: "white" },
    { type: "circle", id: "the circle", x: 100, y: 100, color: "red" },
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
    case "user/createShape": {
        const { type, id, x, y } = action.payload
        return state.concat({ type, id, x, y, color: "black" })
    }
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
