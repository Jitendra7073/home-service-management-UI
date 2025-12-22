import { atom } from 'jotai'

// Service model OPen and Close Global State
export const ServiceModelState = atom<boolean>(false)

export const profileUpgradedTag = atom<any>()