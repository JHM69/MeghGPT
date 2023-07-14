import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Box, Button, Checkbox, Grid, IconButton, Input, Stack, Textarea, Typography, useTheme } from '@mui/joy';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

import { SystemPurposeId, SystemPurposes } from '@/lib/data';
import { useChatStore } from '@/lib/store-chats';
import { usePurposeStore } from '@/lib/store-purposes';
import { useSettingsStore } from '@/lib/store-settings';

// Constants for tile sizes / grid width - breakpoints need to be computed here to work around
// the "flex box cannot shrink over wrapped content" issue
//
// Absolutely dislike this workaround, but it's the only way I found to make it work

const bpTileSize = { xs: 116, md: 125, xl: 130 };
const tileCols = [3, 4, 6];
const tileSpacing = 1;
const bpMaxWidth = Object.entries(bpTileSize).reduce((acc, [key, value], index) => {
  acc[key] = tileCols[index] * (value + 8 * tileSpacing) - 8 * tileSpacing;
  return acc;
}, {} as Record<string, number>);
const bpTileGap = { xs: 2, md: 3 };

// Add this utility function to get a random array element
const getRandomElement = <T extends any>(array: T[]): T | undefined => (array.length > 0 ? array[Math.floor(Math.random() * array.length)] : undefined);

/**
 * Purpose selector for the current chat. Clicking on any item activates it for the current chat.
 */
export function PurposeSelector(props: { conversationId: string; runExample: (example: string) => void }) {
  // state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredIDs, setFilteredIDs] = React.useState<SystemPurposeId[] | null>(null);
  const [editMode, setEditMode] = React.useState(false);

  // external state
  const theme = useTheme();
  const showPurposeFinder = useSettingsStore((state) => state.showPurposeFinder);
  const { systemPurposeId, setSystemPurposeId } = useChatStore((state) => {
    const conversation = state.conversations.find((conversation) => conversation.id === props.conversationId);
    return {
      systemPurposeId: conversation ? conversation.systemPurposeId : null,
      setSystemPurposeId: conversation ? state.setSystemPurposeId : null,
    };
  }, shallow);
  const { hiddenPurposeIDs, toggleHiddenPurposeId } = usePurposeStore(
    (state) => ({ hiddenPurposeIDs: state.hiddenPurposeIDs, toggleHiddenPurposeId: state.toggleHiddenPurposeId }),
    shallow,
  );

  // safety check - shouldn't happen
  if (!systemPurposeId || !setSystemPurposeId) return null;

  const handleSearchClear = () => {
    setSearchQuery('');
    setFilteredIDs(null);
  };

  const handleSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query) return handleSearchClear();
    setSearchQuery(query);

    // Filter results based on search term
    const ids = Object.keys(SystemPurposes)
      .filter((key) => SystemPurposes.hasOwnProperty(key))
      .filter((key) => {
        const purpose = SystemPurposes[key as SystemPurposeId];
        return (
          purpose.title.toLowerCase().includes(query.toLowerCase()) ||
          (typeof purpose.description === 'string' && purpose.description.toLowerCase().includes(query.toLowerCase()))
        );
      });
    setFilteredIDs(ids as SystemPurposeId[]);

    // If there's a search term, activate the first item
    if (ids.length && !ids.includes(systemPurposeId)) handlePurposeChanged(ids[0] as SystemPurposeId);
  };

  const handleSearchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Escape') handleSearchClear();
  };

  const toggleEditMode = () => setEditMode(!editMode);

  const handlePurposeChanged = (purposeId: SystemPurposeId | null) => {
    if (purposeId) setSystemPurposeId(props.conversationId, purposeId);
  };

  const handleCustomSystemMessageChange = (v: React.ChangeEvent<HTMLTextAreaElement>): void => {
    // TODO: persist this change? Right now it's reset every time.
    //       maybe we shall have a "save" button just save on a state to persist between sessions
    SystemPurposes['Custom'].systemMessage = v.target.value;
  };

  // we show them all if the filter is clear (null)
  const unfilteredPurposeIDs = filteredIDs && showPurposeFinder ? filteredIDs : Object.keys(SystemPurposes);
  const purposeIDs = editMode ? unfilteredPurposeIDs : unfilteredPurposeIDs.filter((id) => !hiddenPurposeIDs.includes(id));

  const selectedPurpose = purposeIDs.length ? SystemPurposes[systemPurposeId] ?? null : null;
  const selectedExample = (selectedPurpose?.examples && getRandomElement(selectedPurpose.examples)) || null;

  return (
    <>
      {showPurposeFinder && (
        <Box sx={{ p: 2 * tileSpacing }}>
          <Input
            fullWidth
            variant="outlined"
            color="neutral"
            value={searchQuery}
            onChange={handleSearchOnChange}
            onKeyDown={handleSearchOnKeyDown}
            placeholder="Search for purpose…"
            startDecorator={<SearchIcon />}
            endDecorator={
              searchQuery && (
                <IconButton variant="plain" color="neutral" onClick={handleSearchClear}>
                  <ClearIcon />
                </IconButton>
              )
            }
            sx={{
              boxShadow: theme.vars.shadow.sm,
            }}
          />
        </Box>
      )}

      <Stack direction="column" sx={{ minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ maxWidth: bpMaxWidth }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 2,
              mb: 1,
              overflow: 'hidden',
              whiteSpace: 'wrap',
            }}
          >
            <Typography
              variant="h6"
              color="neutral"
              sx={{
                position: 'relative',
                display: 'inline-block',
                animation: 'typingEffect 3s steps(30)',
                '@keyframes typingEffect': {
                  '0%': {
                    width: '0%',
                  },
                  '50%': {
                    width: '50%',
                  },
                  '100%': {
                    width: '100%',
                  },
                },
              }}
            >
              Welcome to MeghGPT, the future of storytelling! Our platform harnesses the latest APIs and technologies to transform the way stories are crafted. Experience the power of ChatGPT for generating captivating story prompts, unleash your imagination with DALL-E 2 to create stunning anime-style pictures, and bring your words to life with text-to-voice conversion. Get ready to embark on an extraordinary storytelling journey like never before!
            </Typography>
          </Box>


          {systemPurposeId === 'Custom' && (
            <Textarea
              variant="outlined"
              autoFocus
              placeholder={'Craft your custom system message here…'}
              minRows={3}
              defaultValue={SystemPurposes['Custom']?.systemMessage}
              onChange={handleCustomSystemMessageChange}
              sx={{
                background: theme.vars.palette.background.level1,
                lineHeight: 1.75,
                mt: 1,
              }}
            />
          )}
        </Box>
      </Stack>
    </>
  );
}
