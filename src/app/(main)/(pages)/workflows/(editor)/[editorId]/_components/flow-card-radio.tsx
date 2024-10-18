import React from 'react';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';

type Props = {
  status: string;
  onValueChange: (value: string) => void;
};
const FlowCardRadio = ({status, onValueChange}: Props) => {
  return (
    <RadioGroup defaultValue={status} onValueChange={onValueChange}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pending" id="pending" />
        <Label htmlFor="pending">pending</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="current" id="current" />
        <Label htmlFor="current">current</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="completed" id="completed" />
        <Label htmlFor="completed">completed</Label>
      </div>
    </RadioGroup>
  );
};
export default FlowCardRadio;
