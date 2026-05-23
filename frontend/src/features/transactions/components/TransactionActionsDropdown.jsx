import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@/components/ui/Dropdown.jsx'
import Button from '@/components/ui/Button.jsx'
import { cn } from '@/lib/cn.js'

export default function TransactionActionsDropdown({
  onEdit,
  onDelete,
  className,
}) {
  return (
    <Dropdown align="end" className={className}>
      <DropdownTrigger>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('px-2', className)}
          aria-label="Transaction actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={onEdit}>
          <span className="inline-flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </span>
        </DropdownItem>
        <DropdownItem destructive onClick={onDelete}>
          <span className="inline-flex items-center gap-2">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
