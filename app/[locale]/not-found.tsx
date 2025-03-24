import { ErrorDisplay } from '@/components/custom/error-display';

export default async function NotFoundPage() {
  return <ErrorDisplay statusCode="404" />;
}
