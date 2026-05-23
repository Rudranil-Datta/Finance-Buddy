import Select from '@/components/ui/Select.jsx'
import Button from '@/components/ui/Button.jsx'
import { cn } from '@/lib/cn.js'
import {
  categoriesForTransactionType,
  getCategoryId,
} from '@/utils/categoryHelpers.js'

export default function TransactionFilters({
  type,
  categoryId,
  sort,
  categories = [],
  onTypeChange,
  onCategoryChange,
  onSortChange,
  onReset,
  className,
}) {
  const categoryOptions =
    type === 'income' || type === 'expense'
      ? categoriesForTransactionType(categories, type)
      : categories

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center',
        className,
      )}
    >
      <Select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        aria-label="Filter by type"
        className="w-full sm:w-36"
      >
        <option value="">All types</option>
        <option value="expense">Expenses</option>
        <option value="income">Income</option>
      </Select>

      <Select
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="w-full sm:min-w-[10rem] sm:flex-1"
      >
        <option value="">All categories</option>
        {categoryOptions.map((cat) => {
          const id = getCategoryId(cat)
          return (
            <option key={id} value={id}>
              {cat.name}
            </option>
          )
        })}
      </Select>

      <Select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort by date"
        className="w-full sm:w-40"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </Select>

      <Button type="button" variant="ghost" size="sm" onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
