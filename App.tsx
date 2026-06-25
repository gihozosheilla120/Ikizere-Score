import 'react-native-gesture-handler';
import { AppProviders } from './src/providers/AppProviders';
import { RootNavigator } from './src/navigation';

export default function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
