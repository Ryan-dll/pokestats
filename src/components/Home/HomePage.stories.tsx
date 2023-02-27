// Button.stories.js|jsx

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import EverythingDecorator from '../../../.storybook/decorators/EverythingDecorator';

import { addDays } from 'date-fns';
import { convertToDateString } from '../../lib/dates';
import { HomePage, HomePageProps } from './HomePage';
import { DARWIN_MOCK_TOURNAMENT } from '../../../.storybook/mocks';

export default {
  component: HomePage,
  decorators: [EverythingDecorator],
};
//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof HomePage> = (args: HomePageProps) => (
  <HomePage {...args} />
);

//👇 Each story then reuses that template
export const Live = Template.bind({});
Live.args = {
  tournaments: [
    DARWIN_MOCK_TOURNAMENT,
    {
      id: '2',
      name: 'Sydney Regional Championships',
      date: {
        start: convertToDateString(addDays(new Date(), -10)),
        end: convertToDateString(addDays(new Date(), -1)),
      },
      tournamentStatus: 'finished',
      players: {
        juniors: null,
        seniors: null,
        masters: null,
      },
      roundNumbers: {
        juniors: 1,
        seniors: 1,
        masters: 1,
      },
      lastUpdated: 'now',
      rk9link: 'slug',
    },
  ],
};
