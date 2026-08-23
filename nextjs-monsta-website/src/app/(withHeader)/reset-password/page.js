import React, { Suspense } from 'react'
import ResetPassword from './ResetPassword'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <div>
        <ResetPassword/>
      </div>
    </Suspense>
  )
}
