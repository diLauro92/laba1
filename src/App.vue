<template>
  <main class="wrap">
    <h1>ЛР №1 — Инфиксная и постфиксная нотации</h1>

    <div class="menu">
      <button @click="mode = 'infixEval'">Посчитать инфикс</button>
      <button @click="mode = 'postfixEval'">Посчитать постфикс</button>
      <button @click="mode = 'convert'">Инфикс → постфикс</button>
      <button class="ghost" @click="reset">Выход (сброс)</button>
    </div>

    <section v-if="mode === 'infixEval'" class="card">
      <h2>Посчитать выражение в инфиксном виде</h2>

      <input
          v-model="infix"
          class="input"
          placeholder="Напр: (2+3)*4 - -5"
      />

      <div class="actions">
        <button @click="onEvalInfix">Посчитать</button>
        <button class="ghost" @click="fillExample('infix')">Пример</button>
      </div>

      <div v-if="result" class="out">
        <div><b>Постфикс:</b> {{ result.postfix }}</div>
        <div><b>Результат:</b> {{ result.value }}</div>
      </div>
    </section>

    <section v-else-if="mode === 'postfixEval'" class="card">
      <h2>Посчитать выражение в постфиксном виде</h2>

      <input
          v-model="postfix"
          class="input"
          placeholder="Напр: 2 3 + 4 * 5 u- -"
      />

      <div class="actions">
        <button @click="onEvalPostfix">Посчитать</button>
        <button class="ghost" @click="fillExample('postfix')">Пример</button>
      </div>

      <div v-if="postfixValue !== null" class="out">
        <div><b>Результат:</b> {{ postfixValue }}</div>
      </div>
    </section>

    <section v-else-if="mode === 'convert'" class="card">
      <h2>Перевести инфикс → постфикс</h2>

      <input
          v-model="infix"
          class="input"
          placeholder="Напр: 3 + 4 * 2 / (1 - 5) ^ 2"
      />

      <div class="actions">
        <button @click="onConvert">Перевести</button>
        <button class="ghost" @click="fillExample('convert')">Пример</button>
      </div>

      <div v-if="converted" class="out">
        <div><b>Постфикс:</b> {{ converted }}</div>
      </div>
    </section>

    <section v-else class="hint">
      Выбери пункт меню выше.
    </section>

    <div v-if="error" class="error">
      <b>Ошибка:</b> {{ error }}
    </div>

    <footer class="foot">
      Операторы: + - * / ^, скобки ( ) · Унарный минус в постфиксе: <code>u-</code>
    </footer>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { useNotationCalc } from "./composables/useNotationCalc"

const mode = ref('none')

const infix = ref('')
const postfix = ref('')
const result = ref(null)
const postfixValue = ref(null)
const converted = ref('')
const error = ref('')

const { evalInfix, evalPostfix, infixToPostfix } = useNotationCalc()

function clearOutputs () {
  result.value = null
  postfixValue.value = null
  converted.value = ''
  error.value = ''
}

function onEvalInfix() {
  clearOutputs()

  result.value = evalInfix(infix.value)
}

function onConvert() {
  clearOutputs()

  converted.value = infixToPostfix(infix.value)
}

function reset() {
  mode.value = "none"
  infix.value = ""
  postfix.value = ""

  clearOutputs()
}

function fillExample(kind) {
  clearOutputs()

  if (kind === "infix")
    infix.value = "(2+3)*4 - -5"

  if (kind === "convert")
    infix.value = "3 + 4 * 2 / (1 - 5) ^ 2"

  if (kind === "postfix")
    postfix.value = "2 3 + 4 * 5 u- -"
}

function onEvalPostfix() {
  clearOutputs()
  postfixValue.value = evalPostfix(postfix.value)
}

</script>
