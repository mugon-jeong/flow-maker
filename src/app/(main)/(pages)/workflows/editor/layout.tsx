import React from 'react';
import {EditorProvider} from '@/providers/editor-provider';
import {ReactFlowProvider} from '@xyflow/react';

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <ReactFlowProvider>
      <EditorProvider>{children}</EditorProvider>
    </ReactFlowProvider>
  );
}
