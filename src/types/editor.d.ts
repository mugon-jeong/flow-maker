import dynamicIconImports from 'lucide-react/dynamicIconImports';
import {DynamicIconTypes} from '@/components/global/icon';

export const FLowStatus = ['completed', 'current', 'pending'] as const;
export type FlowTypes = 'Start' | 'Condition' | 'Trigger' | 'Action' | 'End';
export type FlowStatusTypes = (typeof FLowStatus)[number];
export type FlowCardType = {
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  metadata: object;
  type: FlowTypes;
  status: FlowStatusTypes;
  icon: DynamicIconTypes | null;
};

export type FlowNodeType = {
  id: string;
  type: FlowCardType['type'];
  selected: boolean;
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
    }
  | {
      type: 'UPDATE_NODE_STATUS';
      payload: {id: string; status: FlowStatusTypes};
    };
