import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { cn } from '@/utilities/cn'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

/** Render all cells for a single row node */
function renderCells(rowNode: any, nodesToJSX: any) {
  return rowNode.children.map((cell: any, ci: number) => {
    const cellChildren = nodesToJSX({ nodes: cell.children })
    const isHeaderCell = cell.headerState === 1 || cell.headerState === 2 || cell.headerState === 3

    if (isHeaderCell) {
      return (
        <TableHead
          key={ci}
          colSpan={cell.colSpan ?? 1}
          rowSpan={cell.rowSpan ?? 1}
          className="font-semibold whitespace-nowrap bg-muted/50 text-foreground"
        >
          {cellChildren}
        </TableHead>
      )
    }

    return (
      <TableCell
        key={ci}
        colSpan={cell.colSpan ?? 1}
        rowSpan={cell.rowSpan ?? 1}
        className="align-top text-foreground/85"
      >
        {cellChildren}
      </TableCell>
    )
  })
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,

  // ── Blocks ─────────────────────────────────────────────────────────────────
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-3xl"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },

  // ── Table ──────────────────────────────────────────────────────────────────
  // Own the entire table tree here so we can produce exactly:
  //   <Table>
  //     <TableHeader> … all header rows … </TableHeader>
  //     <TableBody>   … all body rows   … </TableBody>
  //   </Table>
  table: ({ node, nodesToJSX }) => {
    const rows: any[] = node.children ?? []

    // Leading rows whose headerState is 1 or 3 go into <TableHeader>.
    // As soon as we hit a non-header row, everything else is body.
    let splitIndex = 0
    while (
      splitIndex < rows.length &&
      (rows[splitIndex].headerState === 1 || rows[splitIndex].headerState === 3)
    ) {
      splitIndex++
    }

    const headerRows = rows.slice(0, splitIndex)
    const bodyRows = rows.slice(splitIndex)

    return (
      <div className="my-6 w-full overflow-x-auto rounded-md border border-border shadow-sm">
        <Table className='m-0!'>
          {headerRows.length > 0 && (
            <TableHeader>
              {headerRows.map((row, ri) => (
                <TableRow key={ri}>{renderCells(row, nodesToJSX)}</TableRow>
              ))}
            </TableHeader>
          )}

          <TableBody>
            {bodyRows.map((row, ri) => (
              <TableRow key={ri} className="hover:bg-muted/40 transition-colors">
                {renderCells(row, nodesToJSX)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  },

  // Suppress — the table converter owns all rows and cells directly.
  tablerow: () => null,
  tablecell: () => null,

  // ── Headings ───────────────────────────────────────────────────────────────
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const base = 'font-semibold tracking-tight scroll-m-20'
    const tag = node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    const styles: Record<typeof tag, string> = {
      h1: `${base} text-4xl lg:text-5xl mb-6 mt-0`,
      h2: `${base} text-3xl border-b pb-2 mb-4 mt-10 first:mt-0`,
      h3: `${base} text-2xl mb-3 mt-8`,
      h4: `${base} text-xl mb-3 mt-6`,
      h5: `${base} text-lg mb-2 mt-4`,
      h6: `${base} text-base mb-2 mt-4 text-muted-foreground`,
    }
    const Tag = tag
    return <Tag className={styles[tag]}>{children}</Tag>
  },

  // ── Paragraph ─────────────────────────────────────────────────────────────
  paragraph: ({ node, nodesToJSX }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-4 mb-0 text-foreground/90">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return node.listType === 'bullet' ? (
      <ul className="my-4 ml-6 list-disc [&>li]:mt-1.5 marker:text-muted-foreground">
        {children}
      </ul>
    ) : (
      <ol className="my-4 ml-6 list-decimal [&>li]:mt-1.5 marker:text-muted-foreground">
        {children}
      </ol>
    )
  },

  // listitem: ({ node, nodesToJSX }) => (
  //   <li className="leading-7 pl-1">{nodesToJSX({ nodes: node.children })}</li>
  // ),

  // ── Blockquote ────────────────────────────────────────────────────────────
  quote: ({ node, nodesToJSX }) => (
    <blockquote className="mt-4 mb-4 border-l-4 border-primary pl-5 italic text-muted-foreground [&>p]:mt-0">
      {nodesToJSX({ nodes: node.children })}
    </blockquote>
  ),

  // ── Horizontal rule ───────────────────────────────────────────────────────
  horizontalrule: () => <hr className="my-8 border-border" />,

  // ── Links ─────────────────────────────────────────────────────────────────
  link: ({ node, nodesToJSX }) => {
    const href =
      node.fields?.linkType === 'internal'
        ? (node.fields?.doc?.value as { slug?: string })?.slug ?? '#'
        : (node.fields?.url ?? '#')
    return (
      <a
        href={href}
        target={node.fields?.newTab ? '_blank' : undefined}
        rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
        className="font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all duration-150"
      >
        {nodesToJSX({ nodes: node.children })}
      </a>
    )
  },

  // ── Inline text (bold / italic / strikethrough / underline / code) ─────────
  text: ({ node }) => {
    const { text, format } = node
    let el: React.ReactNode = text

    if (format & 16)
      el = (
        <code className="relative rounded bg-muted px-[0.35rem] py-[0.2rem] font-mono text-[0.85em] font-semibold text-foreground">
          {el}
        </code>
      )
    if (format & 1) el = <strong className="font-semibold">{el}</strong>
    if (format & 2) el = <em>{el}</em>
    if (format & 4) el = <s className="text-muted-foreground/70">{el}</s>
    if (format & 8) el = <u className="underline underline-offset-2">{el}</u>

    // 👇 TextStateFeature stores state in node.$
    const textState = (node as any).$
    if (textState) {
      // Build a CSS string from all state keys (color, underline, etc.)
      // Each value is a key like "blue", "primary" — map it to the CSS you defined
      // But Payload actually stores the resolved CSS directly, so just apply it

      const colorKey = textState.color // e.g. "blue", "primary", "text-red"
      if (colorKey) {
        // The node stores the stateValue key, not the CSS.
        // You need to map it to your CSS here:

        const colorMap: Record<string, React.CSSProperties> = {
          primary: { color: '#154eec' },
          // add your other colors here to match your TextStateFeature config
          'text-red': { color: 'red' },
          'text-blue': { color: 'blue' },
          // ...etc
        }
        const css = colorMap[colorKey]
        if (css) el = <span style={css}>{el}</span>
      }
    }

    return <>{el}</>
  },
})

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const RichText: React.FC<Props> = (props) => {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <RichTextWithoutBlocks
      converters={jsxConverters}
      className={cn(
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose prose-neutral dark:prose-invert md:prose-md': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}