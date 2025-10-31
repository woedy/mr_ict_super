export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-GH').format(value)
}

export function formatDuration(hours: number) {
  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`
  }
  if (hours % 1 === 0) {
    return `${hours} hrs`
  }
  const whole = Math.floor(hours)
  const minutes = Math.round((hours - whole) * 60)
  return `${whole} hr ${minutes} min`
}

export function initialLetters(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}
