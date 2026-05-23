import LoadingScreen from '@/components/feedback/LoadingScreen.jsx'

/**
 * Shown while auth bootstrap or route guard is waiting for isReady.
 */
export default function AuthLoadingScreen({ message = 'Checking your session…' }) {
  return (
    <LoadingScreen
      message={message}
      fullScreen
      className="min-h-[100dvh]"
    />
  )
}
