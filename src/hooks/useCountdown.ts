import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export interface CountdownState {
    endTime: Date
    minutesLeft: number
    secondsLeft: number
    formattedEndTime: string
    expired: boolean
    almostDone: boolean // < 60 seconds left
}

/**
 * Parse interval setting into a Date representing the end time.
 * - number: minutes from now (with optional round-up to nearest 5 min)
 * - ISO string: absolute end time
 * - "HH:mm" string: today at that time
 */
export function parseEndTime(interval: number | string, roundUp: boolean): Date {
    // ISO timestamp (from "Create link")
    if (typeof interval === 'string' && interval.includes('T')) {
        const d = new Date(interval)
        if (!isNaN(d.getTime())) return d
    }

    // "HH:mm" time string  e.g. "14:30"
    if (typeof interval === 'string' && /^\d{1,2}:\d{2}$/.test(interval)) {
        const [h, m] = interval.split(':').map(Number)
        const t = dayjs().hour(h).minute(m).second(0)
        return t.toDate()
    }

    // 12-hour format e.g. "3pm", "3:30pm", "3:30 pm", "3 PM"
    if (typeof interval === 'string') {
        const match = interval.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i)
        if (match) {
            let h = parseInt(match[1], 10)
            const m = match[2] ? parseInt(match[2], 10) : 0
            const isPm = match[3].toLowerCase() === 'pm'
            if (isPm && h !== 12) h += 12
            if (!isPm && h === 12) h = 0
            const t = dayjs().hour(h).minute(m).second(0)
            return t.toDate()
        }
    }

    // Minutes from now
    let minutes = typeof interval === 'number' ? interval : parseInt(interval, 10)
    if (isNaN(minutes)) minutes = 10

    let t = dayjs().add(minutes, 'minute')

    if (roundUp) {
        const remainder = t.minute() % 5
        if (remainder !== 0) {
            t = t.add(5 - remainder, 'minute')
        }
    }

    return t.second(0).toDate()
}

export function useCountdown(interval: number | string, roundUp: boolean): CountdownState {
    const endTimeRef = useRef<Date>(parseEndTime(interval, roundUp))
    const [state, setState] = useState<CountdownState>(() => computeState(endTimeRef.current))

    // Recompute end time when interval/roundUp changes (but not on every tick)
    const prevIntervalRef = useRef(interval)
    const prevRoundUpRef = useRef(roundUp)
    useEffect(() => {
        if (interval !== prevIntervalRef.current || roundUp !== prevRoundUpRef.current) {
            endTimeRef.current = parseEndTime(interval, roundUp)
            prevIntervalRef.current = interval
            prevRoundUpRef.current = roundUp
        }
    }, [interval, roundUp])

    useEffect(() => {
        const tick = () => setState(computeState(endTimeRef.current))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    return state
}

function computeState(endTime: Date): CountdownState {
    const now = dayjs()
    const end = dayjs(endTime)
    const diffMs = end.diff(now)
    const secondsLeft = Math.max(0, Math.floor(diffMs / 1000))
    const minutesLeft = Math.floor(secondsLeft / 60)

    return {
        endTime,
        minutesLeft,
        secondsLeft,
        formattedEndTime: end.format('HH:mm'),
        expired: secondsLeft <= 0,
        almostDone: secondsLeft > 0 && secondsLeft < 60,
    }
}
