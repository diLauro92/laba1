const OPS = {
    "+": { p: 1, a: "L", n: 2 },
    "-": { p: 1, a: "L", n: 2 },
    "*": { p: 2, a: "L", n: 2 },
    "/": { p: 2, a: "L", n: 2 },
    "^": { p: 3, a: "R", n: 2 },
    "u-": { p: 4, a: "R", n: 1 }
}

const isNum = (x) => typeof x === "number" && Number.isFinite(x)

function toInfixTokens(expr) {
    const s = String(expr ?? "").replace(/\s+/g, "");
    if (!s) throw new Error("Пустое выражение");

    const t = [];
    for (let i = 0; i < s.length; ) {
        const ch = s[i];

        if ((ch >= "0" && ch <= "9") || ch === ".") {
            let j = i, dots = 0;
            while (j < s.length && ((s[j] >= "0" && s[j] <= "9") || s[j] === ".")) {
                if (s[j] === "." && ++dots > 1) throw new Error("Некорректное число")
                j++;
            }
            const raw = s.slice(i, j);
            const val = Number(raw);
            if (!Number.isFinite(val)) throw new Error("Некорректное число")
            t.push({ k: "num", raw });
            i = j;
            continue;
        }

        if (ch === "(" || ch === ")") {
            t.push({ k: ch });
            i++;
            continue;
        }

        if ("+-*/^".includes(ch)) {
            t.push({ k: "op", v: ch });
            i++;
            continue;
        }

        throw new Error(`Недопустимый символ: "${ch}"`);
    }

    const out = [];
    for (const x of t) {
        if (x.k === "op" && x.v === "-") {
            const prev = out[out.length - 1];
            const unary = !prev || prev.k === "op" || prev.k === "(";
            out.push({ k: "op", v: unary ? "u-" : "-" });
        } else out.push(x);
    }
    return out;
}

function toPostfixTokens(postfixStr) {
    const parts = String(postfixStr ?? "").trim().split(/\s+/).filter(Boolean)
    if (!parts.length) throw new Error("Пустое выражение")

    return parts.map((p) => (OPS[p] ? p : Number(p)));
}

function infixToPostfix(expr) {
    const tokens = toInfixTokens(expr);
    const out = [];
    const st = [];

    for (const x of tokens) {
        if (x.k === "num") out.push(x.raw);

        else if (x.k === "op") {
            const o1 = x.v
            while (st.length && OPS[st[st.length - 1]]) {
                const o2 = st[st.length - 1]
                const A = OPS[o1], B = OPS[o2]
                const popIt = (A.a === "L" && A.p <= B.p) || (A.a === "R" && A.p < B.p);
                if (!popIt) break
                out.push(st.pop())
            }
            st.push(o1)
        }

        else if (x.k === "(") st.push("(");

        else if (x.k === ")") {
            while (st.length && st[st.length - 1] !== "(") out.push(st.pop())
            if (!st.length) throw new Error("Скобки не сбалансированы")
            st.pop(); // убрать "("
        }
    }

    while (st.length) {
        const top = st.pop()
        if (top === "(") throw new Error("Скобки не сбалансированы")
        out.push(top);
    }

    return out.join(" ")
}

function evalPostfix(postfixStr) {
    const tokens = toPostfixTokens(postfixStr);
    const st = [];

    for (const x of tokens) {
        if (typeof x === "number") {
            if (!isNum(x)) throw new Error("Некорректный токен")
            st.push(x)
            continue
        }

        const op = x
        const info = OPS[op]
        if (!info) throw new Error(`Неизвестный оператор: ${op}`)

        if (info.n === 1) {
            const a = st.pop()
            if (a === undefined) throw new Error("Не хватает операндов")
            st.push(-a)
            continue
        }

        const b = st.pop()
        const a = st.pop()
        if (a === undefined || b === undefined) throw new Error("Не хватает операндов")

        if (op === "+") st.push(a + b)
        else if (op === "-") st.push(a - b)
        else if (op === "*") st.push(a * b)
        else if (op === "/") {
            if (b === 0) throw new Error("Деление на ноль")
            st.push(a / b)
        } else if (op === "^") st.push(a ** b)
    }

    if (st.length !== 1) throw new Error("Лишние операнды/операторы")
    return st[0]
}

function evalInfix(expr) {
    const postfix = infixToPostfix(expr)
    return { postfix, value: evalPostfix(postfix) }
}

export function useNotationCalc() {
    return { infixToPostfix, evalPostfix, evalInfix }
}
