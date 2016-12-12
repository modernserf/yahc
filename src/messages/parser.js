import P from "parsimmon"

const PString = P.seqMap(
    P.string("\""),
    P.regexp(/[^"]*/),
    P.string("\""),
    (_, str) => ["String", str])

const PNumber = P.regexp(/\d+/).map((str) => ["Number", Number(str)])

const selector = P.regexp(/[^\d":.]+:/)
    .map((str) => str.trim().replace(":", ""))

const pair = P.seqMap(
    selector,
    P.optWhitespace,
    P.alt(PString, PNumber),
    (key, __, value) => [key, value])

const messageNoArgs = P.regexp(/[^\d":.]+\./)
    .map((str) => ["Message", [
        [str.trim().replace(".", ""), []],
    ]])

const messageWithArgs = P.sepBy(pair, P.whitespace).skip(P.regexp(/\.?/))
    .map((pairs) => ["Message", pairs])

const PMessage = P.alt(messageNoArgs, messageWithArgs)

const PExpression = P.optWhitespace.then(
    P.alt(PNumber, PString, PMessage)
).skip(P.optWhitespace)

export const parseMessage = (str) => PExpression.parse(str)
