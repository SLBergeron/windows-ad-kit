import React from 'react'

export const Box = ({ as: Component = 'div', children, style = {}, ...rest }: any) => (
  <Component style={style} {...rest}>{children}</Component>
)

export const Container = ({ children, style = {}, ...rest }: any) => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', ...style }} {...rest}>{children}</div>
)

export const Stack = ({ direction = 'column', spacing = '0', align, justify, children, style = {}, ...rest }: any) => (
  <div
    style={{ display: 'flex', flexDirection: direction, gap: spacing, alignItems: align, justifyContent: justify, ...style }}
    {...rest}
  >
    {children}
  </div>
)

export const Grid = ({ columns = 1, gap = '0', children, style = {}, ...rest }: any) => {
  const templateColumns = typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns
  return (
    <div style={{ display: 'grid', gridTemplateColumns: templateColumns, gap, ...style }} {...rest}>
      {children}
    </div>
  )
}

export const Card = ({ children, style = {}, ...rest }: any) => (
  <div style={{ padding: '24px', borderRadius: '8px', background: '#1e293b', ...style }} {...rest}>
    {children}
  </div>
)

export const Heading = ({ as: Component = 'h2', children, style = {}, ...rest }: any) => (
  <Component style={{ margin: 0, ...style }} {...rest}>{children}</Component>
)

export const Text = ({ as: Component = 'p', children, style = {}, ...rest }: any) => (
  <Component style={{ margin: 0, ...style }} {...rest}>{children}</Component>
)

export const Button = ({ children, asChild, style = {}, ...rest }: any) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { style: { textDecoration: 'none', ...style }, ...rest })
  }
  return (
    <button style={style} {...rest}>
      {children}
    </button>
  )
}
