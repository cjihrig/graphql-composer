'use strict'
const { isObject } = require('./utils')

function validateArray (value, name) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${name} must be an array`)
  }
}

function validateFunction (value, name) {
  if (typeof value !== 'function') {
    throw new TypeError(`${name} must be a function`)
  }
}

function validateObject (value, name) {
  if (!isObject(value)) {
    throw new TypeError(`${name} must be a string`)
  }
}

function validateString (value, name) {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string`)
  }
}

module.exports = {
  validateArray,
  validateFunction,
  validateObject,
  validateString
}
