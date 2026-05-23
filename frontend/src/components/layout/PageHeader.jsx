import SectionHeader from '@/components/ui/SectionHeader.jsx'

/**
 * Page-level header for authenticated views — wraps SectionHeader with layout spacing.
 */
export default function PageHeader({ size = 'lg', ...props }) {
  return <SectionHeader size={size} className="mb-0" {...props} />
}
