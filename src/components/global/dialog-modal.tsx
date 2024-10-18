import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {useModal} from '@/providers/modal-provider';

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};
const DialogModal = ({title, description, children}: Props) => {
  const {isOpen, setClose} = useModal();
  const handleClose = () => setClose();
  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
export default DialogModal;
