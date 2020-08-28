import { writable } from 'svelte/store'

export let bkt = 'https://s3.amazonaws.com/negrone'
export const menuHeight = writable('')
export const album = writable('')
export const pic = writable('')