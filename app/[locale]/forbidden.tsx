import { ErrorDisplay } from '@/components/custom/error-display';

export default async function ForbiddenPage() {
  return <ErrorDisplay statusCode="403" />;
}
