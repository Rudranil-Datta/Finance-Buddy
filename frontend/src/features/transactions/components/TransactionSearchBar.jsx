import SearchInput from '@/components/ui/SearchInput.jsx'

export default function TransactionSearchBar({ value, onChange, onClear, className }) {
  return (
    <SearchInput
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClear={onClear}
      placeholder="Search by title or category…"
      aria-label="Search transactions"
    />
  )
}
