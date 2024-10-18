import React, {useEffect, useMemo, useState, useCallback} from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import {FixedSizeGrid as Grid, GridChildComponentProps} from 'react-window';
import Icon, {DynamicIconTypes} from '@/components/global/icon';
import {debounce} from 'lodash';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useModal} from '@/providers/modal-provider';
import {clsx} from 'clsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  onSubmit?: (value: DynamicIconTypes) => void;
};

const IconPicker = ({onSubmit}: Props) => {
  const {setClose} = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<DynamicIconTypes>();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const debouncedSetSearchTerm = useCallback(
    debounce((term: string) => setDebouncedSearchTerm(term), 1000),
    [],
  );

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [searchTerm, debouncedSetSearchTerm]);

  const iconNames = useMemo(() => Object.keys(dynamicIconImports), []);
  const filteredIconNames = useMemo(() => {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return iconNames.filter(name =>
      name.toLowerCase().includes(lowerSearchTerm),
    );
  }, [debouncedSearchTerm, iconNames]);

  const columnCount = 7;
  const rowCount = Math.ceil(filteredIconNames.length / columnCount);
  const iconSize = 60;

  const renderGridCell = useCallback(
    ({columnIndex, rowIndex, style}: GridChildComponentProps) => {
      const index = rowIndex * columnCount + columnIndex;
      if (index >= filteredIconNames.length) return null;
      const name = filteredIconNames[index];

      return (
        <div style={style} key={name} className="p-2 overflow-visible">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Button
                  className={clsx('focus:outline-none', {
                    'border-2 border-red-400': name === selectedIcon,
                  })}
                  size="icon"
                  aria-label={name}
                  onClick={() => {
                    setSearchTerm(name);
                    setSelectedIcon(name as DynamicIconTypes);
                  }}
                >
                  <div className="flex aspect-square items-center justify-center rounded-md border p-2">
                    <Icon name={name as DynamicIconTypes} size={24} />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    [filteredIconNames, selectedIcon],
  );

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <Label htmlFor="icon" className="text-right pb-2">
          Icon
        </Label>
        <Input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="아이콘 검색..."
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="flex items-center justify-center">
        <Grid
          style={{overflow: 'visible'}}
          columnCount={columnCount}
          columnWidth={iconSize}
          height={400}
          rowCount={rowCount}
          rowHeight={iconSize}
          width={iconSize * columnCount}
        >
          {renderGridCell}
        </Grid>
      </div>

      <Button
        className="mt-24"
        onClick={() => {
          if (onSubmit && selectedIcon) onSubmit(selectedIcon);
          setClose();
        }}
      >
        Save changes
      </Button>
    </div>
  );
};

export default IconPicker;
