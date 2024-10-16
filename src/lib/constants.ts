import {Home, Workflow} from 'lucide-react';
import {FlowNodeType, FlowTypes} from '@/types/editor';

export const menuOptions = [
  {name: 'Dashboard', Component: Home, href: '/dashboard'},
  {name: 'Workflow', Component: Workflow, href: '/workflows'},
];

export const EditorCanvasDefaultCardTypes: {
  [key in FlowTypes]: {description: string; type: FlowTypes};
} = {
  Start: {description: 'Send and email to a user', type: 'Start'},
  Condition: {
    description: 'Boolean operator that creates different conditions lanes.',
    type: 'Condition',
  },
  Trigger: {
    description: 'An event that starts the workflow.',
    type: 'Trigger',
  },
  Action: {
    description: 'An event that happens after the workflow begins',
    type: 'Action',
  },
  End: {
    description: 'Delay the next action step by using the wait timer.',
    type: 'End',
  },
};
