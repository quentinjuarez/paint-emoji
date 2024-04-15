import { NavigationGuardWithThis, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

function evaluateGuards(
  guards: NavigationGuardWithThis<any>[],
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const guardsLeft = guards.slice(0) // clone the array so we do not accidentally modify it
  const nextGuard = guardsLeft.shift()

  if (!nextGuard) {
    next()
    return
  }

  const applyNext = (nextArg: any) => {
    if (!nextArg) {
      evaluateGuards(guardsLeft, to, from, next)
      return
    }

    next(nextArg)
  }

  nextGuard(to, from, applyNext as NavigationGuardNext)
}

export const applyMiddlewares = (guards: NavigationGuardWithThis<any>[]) => {
  if (!Array.isArray(guards)) {
    throw new Error('You must specify an array of guards')
  }

  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // Not a refresh and just a hash change
    // Or a replace with silent query param
    if (
      (from.name !== undefined &&
        to.path === from.path &&
        JSON.stringify(to.query) === JSON.stringify(from.query)) ||
      to.query.silent === 'true'
    )
      return next()

    return evaluateGuards(guards, to, from, next)
  }
}
