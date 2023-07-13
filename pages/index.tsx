import * as React from 'react';

import { Container, useTheme } from '@mui/joy';

import { Chat } from '@/components/Chat';
import { NoSSR } from '@/components/util/NoSSR';
import { isValidOpenAIApiKey, SettingsModal } from '@/components/dialogs/SettingsModal';
import { useSettingsStore } from '@/lib/store-settings';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
  // state
  const [settingsShown, setSettingsShown] = React.useState(false);

  // external state
  const theme = useTheme();
  const apiKey = useSettingsStore((state) => state.apiKey);
  const centerMode = useSettingsStore((state) => state.centerMode);
  const router = useRouter();

  const { status: sessionStatus } = useSession();

  // show the Settings Dialog at startup if the API key is required but not set
  React.useEffect(() => {
    console.log('sessionStatus');
    console.log(sessionStatus);

    if (sessionStatus === 'unauthenticated') {
      router.push(`/login`);
      return;
    }
  }, [sessionStatus]);

  return (
    /**
     * Note the global NoSSR wrapper
     *  - Even the overall container could have hydration issues when using localStorage and non-default maxWidth
     */
    <NoSSR>
      <Container
        maxWidth={centerMode === 'full' ? false : centerMode === 'narrow' ? 'md' : 'xl'}
        disableGutters
        sx={{
          boxShadow: {
            xs: 'none',
            md: centerMode === 'narrow' ? theme.vars.shadow.md : 'none',
            xl: centerMode !== 'full' ? theme.vars.shadow.lg : 'none',
          },
        }}
      >
        <Chat onShowSettings={() => setSettingsShown(true)} />

        <SettingsModal open={settingsShown} onClose={() => setSettingsShown(false)} />
      </Container>
    </NoSSR>
  );
}
