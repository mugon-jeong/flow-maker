import React, {useEffect, useMemo, useState} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {NodeResizer, Position, useReactFlow} from '@xyflow/react';
import {FlowCardType, FlowNodeType, FlowStatusTypes} from '@/types/editor';
import CustomHandle from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/custom-handle';
import {Button} from '@/components/ui/button';
import {useModal} from '@/providers/modal-provider';
import DialogModal from '@/components/global/dialog-modal';
import Icon, {DynamicIconTypes} from '@/components/global/icon';
import IconPicker from '@/components/global/icon-picker';
import FlowCardRadio from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/flow-card-radio';
import FocusInput from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/focus-input';
import FlowCardInfobox from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/flow-card-infobox';
import {Label} from '@/components/ui/label';
import {supabaseClient} from '@/lib/supabase-client';
import {X} from 'lucide-react';

type Props = {
  id: string;
  data: FlowCardType;
  selected?: boolean | undefined;
};
const FlowCard = ({id, data, selected}: Props) => {
  const {setOpen} = useModal();
  const supabase = supabaseClient();
  const [flowStatus, setFlowStatus] = useState<FlowStatusTypes>(data.status);
  const [title, setTitle] = useState(data.title);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [description, setDescription] = useState(data.description);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {updateNodeData, setNodes} = useReactFlow<FlowNodeType>();
  const [searchIcon, setSearchIcon] = useState(data.icon || 'workflow');
  const [fileName, setFileName] = useState(data.fileName);
  const [uploading, setUploading] = useState(false);
  const onEditing = (value: string) => {
    if (data.status === value) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setFlowStatus(value as FlowStatusTypes);
    }
  };

  const logo = useMemo(() => {
    return <Icon name={searchIcon as DynamicIconTypes} />;
  }, [searchIcon]);

  const handleIconModal = () => {
    setOpen(
      <DialogModal title={'Icon Picker'}>
        <IconPicker onSubmit={onChangeIcon} />
      </DialogModal>,
    );
  };

  const onChangeIcon = (value: DynamicIconTypes) => {
    if (data.icon !== value) {
      setIsEditing(true);
      setSearchIcon(value);
    }
  };

  const onNodeClick = () => {
    setNodes(nodes => {
      return nodes.map(n => {
        if (n.id === id) {
          return {
            ...n,
            selected: true,
          };
        }
        return {...n, selected: false};
      });
    });
  };

  const uploadFile: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${id}-${Math.random()}.${fileExt}`;

      // 저장하기 전 기존 파일 삭제
      if (data.fileUrl) {
        const {error: deleteError} = await supabase.storage
          .from('flow-card')
          .remove([data.fileUrl]);

        if (deleteError) {
          throw deleteError;
        }
      }

      const {error: uploadError} = await supabase.storage
        .from('flow-card')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      // filepath를 저장
      setFileName(file.name);
      updateNodeData(id, {
        fileUrl: filePath,
        fileName: file.name,
      });
    } catch (error) {
      alert(`Error uploading file! ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async () => {
    if (!data.fileUrl) return;
    const {error: deleteError} = await supabase.storage
      .from('flow-card')
      .remove([data.fileUrl]);
    setFileName(null);
    updateNodeData(id, {
      fileUrl: null,
      fileName: null,
    });
  };

  const onSubmit = () => {
    updateNodeData(id, {
      status: flowStatus,
      icon: searchIcon,
      title: title,
      description: description,
    });
    setIsEditing(false);
  };

  useEffect(() => {
    if (data.title !== title) {
      setIsEditing(true);
    }
    if (data.description !== description) {
      setIsEditing(true);
    }
    if (data.title === title && data.description === description) {
      setIsEditing(false);
    }
  }, [data.description, data.title, description, title]);
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      {data.type != 'Start' && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{zIndex: 100}}
        />
      )}
      <Card
        onClick={e => {
          e.stopPropagation();
          onNodeClick();
        }}
        className="relative dark:border-muted-foreground/70 w-full h-full"
      >
        <FlowCardInfobox id={id} type={data.type} />
        <CardHeader className="flex flex-row items-center pt-0 gap-4">
          <div className={'cursor-pointer'} onClick={handleIconModal}>
            {logo}
          </div>
          <div>
            {isTitleEditing ? (
              <CardTitle className="text-md">
                <FocusInput
                  value={title}
                  editStatus={isTitleEditing}
                  onChange={setTitle}
                  onBlur={() => setIsTitleEditing(false)}
                />
              </CardTitle>
            ) : (
              <CardTitle
                className="text-md cursor-pointer"
                onClick={() => setIsTitleEditing(true)}
              >
                {title}
              </CardTitle>
            )}
            {isDescriptionEditing ? (
              <CardDescription>
                <FocusInput
                  value={description}
                  editStatus={isDescriptionEditing}
                  onChange={setDescription}
                  onBlur={() => setIsDescriptionEditing(false)}
                />
              </CardDescription>
            ) : (
              <CardDescription
                className={'cursor-pointer'}
                onClick={() => setIsDescriptionEditing(true)}
              >
                <p>{description}</p>
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent className={'flex flex-row justify-between'}>
          <div>
            <Label
              className="button block bg-gray-500 h-fit p-2 rounded cursor-pointer"
              htmlFor="single"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Label>
            <input
              style={{
                visibility: 'hidden',
                position: 'absolute',
              }}
              type="file"
              id="single"
              accept="*/*"
              onChange={uploadFile}
              disabled={uploading}
            />
            {fileName && (
              <div
                className={
                  'mt-2 flex flex-row gap-2 justify-center items-center'
                }
              >
                <p>{fileName}</p>
                <Button size={'icon'} onClick={deleteFile}>
                  <X />
                </Button>
              </div>
            )}
          </div>
          <FlowCardRadio status={data.status} onValueChange={onEditing} />
          {isEditing && (
            <div className={'flex flex-col justify-end'}>
              <Button onClick={onSubmit}>Submit</Button>
            </div>
          )}
        </CardContent>
      </Card>
      {data.type !== 'End' && (
        <CustomHandle type="source" position={Position.Bottom} id="a" />
      )}
    </>
  );
};
export default FlowCard;
