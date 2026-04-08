import HomePage from './[locale]/page';
import { LocaleLayout } from './locale-layout';

export default function RootPage() {
  return (
    <LocaleLayout>
      <HomePage />
    </LocaleLayout>
  );
}
