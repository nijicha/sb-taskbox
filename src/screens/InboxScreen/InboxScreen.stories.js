import React from 'react';
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { fireEvent, within } from "@storybook/testing-library";

import { PureInboxScreen } from './index';

import * as TaskListStories from "../../components/TaskList/TaskList.stories";

const mockStore = configureStore({
  reducer: {
    tasks: createSlice({
      name: 'tasks',
      initialState: TaskListStories.Default.args.tasks,
      reducers: {
        updateTaskState: (state, action) => {
          const { id, newTaskState } = action.payload
          const task = state.findIndex((task) => task.id === id)
          if (task >= 0) {
            state[task].state = newTaskState
          }
        }
      }
    }).reducer
  }
})

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  decorators: [story => <Provider store={mockStore}>{story()}</Provider>]
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};

export const WithInteractions = Template.bind({})
WithInteractions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  // Simulates pinning the tasks
  fireEvent.click(canvas.getByLabelText('pinTask-1'))
  fireEvent.click(canvas.getByLabelText('pinTask-3'))
}
