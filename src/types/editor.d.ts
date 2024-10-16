import {NodeTypes} from '@xyflow/react';

export type FlowTypes = 'Start' | 'Condition' | 'Trigger' | 'Action' | 'End';

export type FlowCardType = {
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  metadata: object;
  type: FlowTypes;
};

export type FlowNodeType = {
  id: string;
  type: FlowCardType['type'];
  position: {
    x: number;
    y: number;
  };
  data: FlowCardType;
};

export type EditorActions =
  | {
      type: 'LOAD_DATA';
      payload: {
        elements: FlowNodeType[];
        edges: {
          id: string;
          source: string;
          target: string;
        }[];
      };
    }
  | {
      type: 'UPDATE_NODE';
      payload: {
        elements: FlowNodeType[];
      };
    }
  | {type: 'REDO'}
  | {type: 'UNDO'}
  | {
      type: 'SELECTED_ELEMENT';
      payload: {
        element: FlowNodeType;
      };
    };
