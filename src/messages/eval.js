import P from "parsimmon"

const selectorDefNoArg = P.regexp(/[^:]+$/).map((k) => [[k]])

const selectorDefPair = P.seqMap(
    P.regexp(/[^:]+/),
    P.string(":"),
    P.regexp(/\w+/),
    (k, _, v) => [k, v])

const selectorDef = P.alt(
    selectorDefNoArg,
    P.sepBy(selectorDefPair, P.whitespace))

export const parseSelectorDef = (str) => selectorDef.parse(str).value

function indexBySelector (messages) {
    return messages.reduce((m, { selector, action }) => {
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
}

export function createEvalMessage (messages) {
    const bySelector = indexBySelector(messages)

    return ([type, body], str) => {
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
}
