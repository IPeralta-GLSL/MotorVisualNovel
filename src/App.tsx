import { ReactFlowProvider } from '@xyflow/react'
import Editor from '@/editor/Editor'

export default function App() {
  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  )
}