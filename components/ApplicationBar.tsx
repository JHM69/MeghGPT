import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Badge, IconButton, ListDivider, ListItemDecorator, Menu, MenuItem, Sheet, Stack, Switch, useColorScheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import ClearIcon from '@mui/icons-material/Clear';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import { ChatModelId, ChatModels, SystemPurposeId, SystemPurposes } from '@/lib/data';
import { ConfirmationModal } from '@/components/dialogs/ConfirmationModal';
import { PagesMenu } from '@/components/Pages';
import { StyledDropdown } from '@/components/util/StyledDropdown';
import { StyledDropdownWithSymbol } from '@/components/util/StyledDropdownWithSymbol';
import { useChatStore } from '@/lib/store-chats';
import { useSettingsStore } from '@/lib/store-settings';
import Link from 'next/link';
import { Login } from '@mui/icons-material';
import { signOut } from 'next-auth/react';

/**
 * The top bar of the application, with the model and purpose selection, and menu/settings icons
 */
export function ApplicationBar(props: {
  conversationId: string | null;
  onDownloadConversationJSON: (conversationId: string) => void;
  onPublishConversation: (conversationId: string) => void;
  onShowSettings: () => void;
  sx?: SxProps;
}) {
  // state
  const [clearConfirmationId, setClearConfirmationId] = React.useState<string | null>(null);
  const [pagesMenuAnchor, setPagesMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [actionsMenuAnchor, setActionsMenuAnchor] = React.useState<HTMLElement | null>(null);

  // settings

  const { mode: colorMode, setMode: setColorMode } = useColorScheme();

  const { freeScroll, setFreeScroll, showSystemMessages, setShowSystemMessages, zenMode } = useSettingsStore(
    (state) => ({
      freeScroll: state.freeScroll,
      setFreeScroll: state.setFreeScroll,
      showSystemMessages: state.showSystemMessages,
      setShowSystemMessages: state.setShowSystemMessages,
      zenMode: state.zenMode,
    }),
    shallow,
  );

  const closePagesMenu = () => setPagesMenuAnchor(null);

  const closeActionsMenu = () => setActionsMenuAnchor(null);

  const handleDarkModeToggle = () => setColorMode(colorMode === 'dark' ? 'light' : 'dark');

  const handleScrollModeToggle = () => setFreeScroll(!freeScroll);

  const handleSystemMessagesToggle = () => setShowSystemMessages(!showSystemMessages);

  const handleActionShowSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onShowSettings();
    closeActionsMenu();
  };

  // conversation actions

  const { conversationsCount, isConversationEmpty, chatModelId, systemPurposeId, setMessages, setChatModelId, setSystemPurposeId, setAutoTitle } = useChatStore(
    (state) => {
      const conversation = state.conversations.find((conversation) => conversation.id === props.conversationId);
      return {
        conversationsCount: state.conversations.length,
        isConversationEmpty: conversation ? !conversation.messages.length : true,
        chatModelId: conversation ? conversation.chatModelId : null,
        systemPurposeId: conversation ? conversation.systemPurposeId : null,
        setMessages: state.setMessages,
        setChatModelId: state.setChatModelId,
        setSystemPurposeId: state.setSystemPurposeId,
        setAutoTitle: state.setAutoTitle,
      };
    },
    shallow,
  );

  const handleLogut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setClearConfirmationId(props.conversationId);
  };

  const handleSignOut = () => {
    if (clearConfirmationId) {
      signOut({ redirect: true, callbackUrl: '/' });
    }
  };

  const handleConversationPublish = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    props.conversationId && props.onPublishConversation(props.conversationId);
  };

  const handleConversationDownload = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    props.conversationId && props.onDownloadConversationJSON(props.conversationId);
  };

  const handleChatModelChange = (event: any, value: ChatModelId | null) => value && props.conversationId && setChatModelId(props.conversationId, value);

  const handleSystemPurposeChange = (event: any, value: SystemPurposeId | null) =>
    value && props.conversationId && setSystemPurposeId(props.conversationId, value);

  return (
    <>
      {/* Top Bar with 2 icons and Model/Purpose selectors */}
      <Sheet
        variant="solid"
        color="neutral"
        invertedColors
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          ...(props.sx || {}),
        }}
      >

          <IconButton variant="plain" onClick={(event) => setPagesMenuAnchor(event.currentTarget)}>        

          <div className="banner-container mx-auto">
            <img className="banner" src="https://i.ibb.co/Lg2ctwf/megh-gpt.gif" alt="Story-Verse-1" />
          </div>
          </IconButton>
        

        <IconButton variant="plain" onClick={(event) => setPagesMenuAnchor(event.currentTarget)}></IconButton>


        <Stack direction="row" sx={{ my: 'auto' }}>
          {/* {chatModelId && <StyledDropdown items={ChatModels} value={chatModelId} onChange={handleChatModelChange} />} */}

          {systemPurposeId &&
            (zenMode === 'cleaner' ? (
              <StyledDropdown items={SystemPurposes} value={systemPurposeId} onChange={handleSystemPurposeChange} />
            ) : (
              <StyledDropdownWithSymbol items={SystemPurposes} value={systemPurposeId} onChange={handleSystemPurposeChange} />
            ))}
          >
            {' '}
            <Link href="/bookvarse" target="_blank">
              Go to StoryVerse
            </Link>{' '}
          </button>
        </Stack>

      </Sheet>

      {/* Left menu */}
      {/* {<PagesMenu conversationId={props.conversationId} pagesMenuAnchor={pagesMenuAnchor} onClose={closePagesMenu} />} */}

      {/* Confirmations */}
      <ConfirmationModal
        open={!!clearConfirmationId}
        onClose={() => setClearConfirmationId(null)}
        onPositive={handleSignOut}
        confirmationText={'Are you sure you want to log out ?'}
        positiveActionText={'Log Out'}
      />
    </>
  );
}
