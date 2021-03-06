import Layout from '../../../Layout'
import transformNumeric from '../../math/transformNumeric'
import generateAreasList from '../../templates/generateAreasList'
import getAreaBreakpoints from './getAreaBreakpoints'

test('Mobile first', () => {
  const { templates } = generateAreasList({
    template: `'a b'`,
    templateLg: `'a'`,
  })

  const areaBreakpoints = getAreaBreakpoints('a', templates)
  expect(areaBreakpoints).toEqual([
    {
      behavior: 'up',
      minWidth: undefined,
      maxWidth: undefined,
    },
  ])
})

test('Inclusive', () => {
  const breakpointMd = Layout.getBreakpoint('md')
  const breakpointXl = Layout.getBreakpoint('xl')
  const { templates } = generateAreasList({
    template: `'a'`,
    templateMd: `'a b'`,
    templateXl: `'a'`,
  })

  const areaBreakpoints = getAreaBreakpoints('b', templates)

  expect(areaBreakpoints).toEqual([
    null,
    {
      behavior: 'down',
      minWidth: breakpointMd.minWidth,
      maxWidth: `calc(${transformNumeric(breakpointXl.minWidth)} - 1px)`,
    },
    null,
  ])
})

test('Notch', () => {
  const breakpointXs = Layout.getBreakpoint('xs')
  const breakpointMd = Layout.getBreakpoint('md')
  const breakpointXl = Layout.getBreakpoint('xl')

  const { templates } = generateAreasList({
    template: `'a b'`,
    templateMd: `'a'`,
    templateXl: `'a b'`,
  })

  const areaBreakpoints = getAreaBreakpoints('b', templates)
  expect(areaBreakpoints).toEqual([
    {
      behavior: 'down',
      minWidth: breakpointXs.minWidth,
      maxWidth: `calc(${transformNumeric(breakpointMd.minWidth)} - 1px)`,
    },
    null,
    {
      behavior: 'up',
      minWidth: breakpointXl.minWidth,
    },
  ])
})

describe('Shuffled behavior', () => {
  test('Concatenates sibling areas with "down" behavior', () => {
    const breakpointSm = Layout.getBreakpoint('sm')
    const breakpointMd = Layout.getBreakpoint('md')

    const { templates } = generateAreasList({
      template: `'a'`,
      templateSmDown: `'c'`,
      templateMdDown: `'a c'`,
    })

    /* Area "a" */
    const areaBreakpointsA = getAreaBreakpoints('a', templates)
    expect(areaBreakpointsA).toEqual([
      {
        behavior: 'down',
        minWidth: undefined,
        maxWidth: `calc(${transformNumeric(breakpointSm.minWidth)} - 1px)`,
      },
      null,
      {
        behavior: 'down',
        minWidth: breakpointMd.minWidth,
        maxWidth: breakpointMd.maxWidth,
      },
    ])

    /* Area "c" */
    const areaBreakpointsC = getAreaBreakpoints('c', templates)
    expect(areaBreakpointsC).toEqual([
      null,
      {
        behavior: 'down',
        minWidth: breakpointSm.minWidth,
        maxWidth: breakpointMd.maxWidth,
      },
    ])
  })

  test('Notch behavior using explicit "down" area behavior', () => {
    const { templates } = generateAreasList({
      templateDown: `'a'`,
      templateMd: `'a c'`,
    })

    /* Area "a" */
    const areaBreakpointsA = getAreaBreakpoints('a', templates)
    expect(areaBreakpointsA).toEqual([
      {
        behavior: 'down',
        maxWidth: Layout.getBreakpoint('xs').maxWidth,
      },
      {
        behavior: 'up',
        minWidth: Layout.getBreakpoint('md').minWidth,
        maxWidth: undefined,
      },
    ])

    /* Area "c" */
    const areaBreakpointsC = getAreaBreakpoints('c', templates)
    expect(areaBreakpointsC).toEqual([
      null,
      {
        behavior: 'up',
        minWidth: Layout.getBreakpoint('md').minWidth,
        maxWidth: undefined,
      },
    ])
  })
})
