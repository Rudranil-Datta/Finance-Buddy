import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import TransactionForm from './TransactionForm.jsx'
import { toApiPayload } from '../utils/transactionHelpers.js'

const FORM_ID = 'transaction-form'

export default function TransactionFormModal({
  open,
  mode = 'create',
  initialValues,
  categories,
  categoriesLoading = false,
  saving = false,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit'

  function handleFormSubmit(form) {
    onSubmit?.(toApiPayload(form))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit transaction' : 'New transaction'}
      description={
        isEdit
          ? 'Update amount, category, or date for this entry.'
          : 'Record income or spending — synced with your budgets and analytics.'
      }
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={saving}>
            {isEdit ? 'Save changes' : 'Add transaction'}
          </Button>
        </>
      }
    >
      <TransactionForm
        key={`${mode}-${initialValues?.type ?? 'expense'}-${initialValues?.categoryId ?? 'new'}`}
        formId={FORM_ID}
        initialValues={initialValues}
        categories={categories}
        categoriesLoading={categoriesLoading}
        onSubmit={handleFormSubmit}
      />
    </Modal>
  )
}
