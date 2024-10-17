import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {useModal} from '@/providers/modal-provider';

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
};
const DialogModal = ({title, description, onSubmit, children}: Props) => {
  const {isOpen, setClose} = useModal();
  const handleClose = () => setClose();
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              if (onSubmit) onSubmit();
              handleClose();
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DialogModal;
