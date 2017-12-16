import * as React from 'react'
import { connect } from 'react-redux'

import { Finder } from '../../models/Finder'
import * as F from '../../models/Formula'
import * as Q from '../../queries'
import * as T from '../../types'
import * as S from '../../selectors'

import Suggestions from './Suggestions'

const TAB = 9, ENTER = 13, UP = 38, DOWN = 40 // RIGHT = 39

type Formula = F.Formula<T.Property>

interface OwnProps {
  name?: string
  value?: string
  placeholder?: string
  suggestionLimit?: number
  onChange?: (q: string) => void
  onFormulaChange?: (f?: Formula) => void
}

interface StateProps {
  properties: Finder<T.Property>
}

type Props = OwnProps & StateProps

interface State {
  selected: number
  dropdownVisible: boolean
  formula: Formula | undefined
}

class FormulaInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selected: 0,
      dropdownVisible: false,
      formula: undefined
    }
  }

  changeSelection(delta: number) {
    this.setState(({ selected }) => ({ selected: selected + delta }))
  }

  suggestions() {
    return Q.suggestionsFor(this.props.properties, this.props.value || '', 10)
  }

  expandFragment(index?: number) {
    const selected = this.suggestions()[index || this.state.selected]
    const expanded = Q.replaceFragment(this.props.value || '', selected.name)

    this.handleChange(expanded)
    this.setState({
      selected: 0,
      dropdownVisible: false
    })
  }

  handleKeyDown(e: any) {
    switch (e.which) {
      case UP:
        e.preventDefault()
        return this.changeSelection(-1)
      case DOWN:
        e.preventDefault()
        return this.changeSelection(1)
      case ENTER:
      case TAB:
        if (this.state.dropdownVisible) {
          e.preventDefault()
          this.expandFragment()
        }
        return
      default:
        return
    }
  }

  parseFormula(query: string): F.Formula<T.Property> | undefined {
    const parsed = F.parse(query)
    if (!parsed) { return }

    let missing = false
    const result = F.mapProperty(
      id => {
        const property = this.props.properties.find(id)
        if (!property) { missing = true }
        return property as T.Property
      },
      parsed
    )

    if (missing) { return }
    return result
  }

  handleChange(newValue: string) {
    if (this.props.onChange) { this.props.onChange(newValue) }

    this.setState(({ formula }) => {
      const parsed = this.parseFormula(newValue)
      if (parsed !== formula && this.props.onFormulaChange) {
        this.props.onFormulaChange(parsed)
      }

      return {
        formula: parsed,
        dropdownVisible: !!newValue && newValue[0] !== ':'
      }
    })
  }

  handleBlur() {
    this.setState({ dropdownVisible: false })
  }

  render() {
    return (
      <div>
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          name={this.props.name}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onKeyDown={e => this.handleKeyDown(e)}
          onChange={e => this.handleChange(e.target.value)}
          onBlur={() => this.handleBlur()}
        />

        <Suggestions
          suggestions={this.suggestions()}
          selected={this.state.selected}
          visible={this.state.dropdownVisible}
          limit={this.props.suggestionLimit || 10}
          onSelect={i => this.expandFragment(i)}
        />
      </div>
    )
  }
}

export default connect(
  (state: T.State): StateProps => ({
    properties: S.propertyFinder(state)
  })
)(FormulaInput)
