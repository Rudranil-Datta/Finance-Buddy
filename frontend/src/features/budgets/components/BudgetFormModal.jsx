import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import BudgetForm, { BUDGET_FORM_ID } from './BudgetForm.jsx'

export default function BudgetFormModal({
  open,
  mode = 'create',
  initialValues,
  categories,
  editingId = null,
  existingCategoryIds = [],
  saving = false,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit budget' : 'New budget'}
      description={
        isEdit
          ? 'Update limit, period, or alert threshold for this category.'
          : 'Set a spending cap per category — we track expenses against it automatically.'
      }
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={BUDGET_FORM_ID} loading={saving}>
            {isEdit ? 'Save changes' : 'Create budget'}
          </Button>
        </>
      }
    >
      <BudgetForm
        key={`${editingId ?? 'new'}-${initialValues.categoryId}`}
        initialValues={initialValues}
        categories={categories}
        editingId={editingId}
        existingCategoryIds={existingCategoryIds}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}
