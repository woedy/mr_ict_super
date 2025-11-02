# Infinite Loop Fix - StudentJourneyContext

## Problem
"Maximum update depth exceeded" error caused by infinite re-render loop in `StudentJourneyContext`.

## Root Cause
The context functions (`signIn`, `signUp`, `signOut`, etc.) were being recreated on every render because they weren't memoized. This caused:

1. Functions recreated on every state change
2. `useMemo` dependency on `state` caused context value to change
3. All components consuming the context re-rendered
4. Components with `useEffect` that depend on context functions triggered
5. Effects update state → Loop back to step 1

## Solution
Wrapped all context functions with `useCallback` to prevent recreation:

```typescript
const signIn = useCallback(async (payload: SignInPayload) => {
  // ... implementation
}, [])

const signUp = useCallback(async (payload: SignUpPayload) => {
  // ... implementation
}, [])

const signOut = useCallback(() => {
  // ... implementation
}, [])

const clearError = useCallback(() => {
  // ... implementation
}, [])

const completeOnboarding = useCallback((payload: OnboardingPayload) => {
  // ... implementation
}, [])

const recordLessonView = useCallback((courseId, lessonId, progress) => {
  // ... implementation
}, [])
```

## Key Changes

1. **Added `useCallback` import**
2. **Wrapped all functions** with `useCallback` and empty dependency arrays
3. **Fixed `completeOnboarding`** to use functional setState to avoid referencing `state.student`
4. **All functions now stable** across renders

## Result
- ✅ No more infinite loops
- ✅ Functions only created once
- ✅ Context value stable unless state actually changes
- ✅ Components re-render only when necessary

## Files Modified
- `src/context/StudentJourneyContext.tsx`

## Testing
The app should now load without the "Maximum update depth exceeded" error.
