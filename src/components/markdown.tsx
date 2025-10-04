import Markdown, { type Components } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'

type MarkdownRendererProps = {
  children: string
  className?: string
  components?: Partial<Components>
  remarkPlugins?: []
  rehypePlugins?: []
}

export default function MarkdownRenderer ({
  children,
  className,
  components,
  remarkPlugins = [],
  rehypePlugins = []
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-cont ${className}`}>
      <Markdown
        remarkPlugins={[...remarkPlugins]}
        rehypePlugins={[
          [rehypeExternalLinks, { target: '_blank' }],
          ...rehypePlugins
        ]}
        components={components}
      >
        {children}
      </Markdown>
    </div>
  )
}
