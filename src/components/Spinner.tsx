interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full border-2 border-green/30 border-t-green animate-spin`}
    />
  )
}
