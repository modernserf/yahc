import { createStore, applyMiddleware, combineReducers } from "redux"
import createSagaMiddleware from "redux-saga"

export const actions = {
    userSentMessage: (msg) => ({ type: "userSentMessage", payload: msg }),
}

const logReducer = (state = [], action) => {
    if (action.type === "userSentMessage") {
        return state.concat(action.payload)
    }
    return state
}

const rootReducer = combineReducers({
    log: logReducer,
})

const sagaMiddleware = createSagaMiddleware()
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

// TODO: parse userSentMessage
export const runSaga = () => {
    // sagaMiddleware.run()
}
