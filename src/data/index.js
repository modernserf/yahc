import { createStore, applyMiddleware, combineReducers } from "redux"
import createSagaMiddleware from "redux-saga"
import createLogger from "redux-logger"
import { reducer as messageReducer, runUserMessages } from "../messages"
import { createShape } from "../shape"
import { createCard } from "../card"

export const actions = {
    userSentMessage: (msg) => ({ type: "userSentMessage", payload: msg }),
}

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
    createCard({
        id: "the card", width: 500, height: 500,
    }),
    createShape({
        shape: "circle", id: "the circle",
        x: 100, y: 100, fill: "red",
    }),
]

function updateProps (state, id, fn) {
    return state.map((s) => {
        if (s.id !== id) { return s }
        return { ...s, props: { ...s.props, ...fn(s.props) } }
    })
}

const workspaceReducer = (state = initWorkspace, action) => {
    switch (action.type) {
    case "user/move": {
        const { id, x, y } = action.payload
        return updateProps(state, id, () => ({ x, y }))
    }
    case "user/changeColor": {
        const { id, color } = action.payload
        return updateProps(state, id, () => ({ color }))
    }
    case "user/resize": {
        const { id, width, height } = action.payload
        return updateProps(state, id, (s) => ({ width, height }))
    }
    case "user/createShape": {
        const { shape, id } = action.payload
        return state.concat(createShape({ shape, id }))
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
    messages: messageReducer,
})

function * rootSaga () {
    yield [
        runUserMessages,
    ]
}

const sagaMiddleware = createSagaMiddleware()
const logger = createLogger({ collapsed: true })
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger))

export const runSaga = () => {
    sagaMiddleware.run(rootSaga)
}
